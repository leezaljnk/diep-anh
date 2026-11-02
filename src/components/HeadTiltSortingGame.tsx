import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  CirclePause,
  Eye,
  EyeOff,
  Leaf,
  Play,
  Recycle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { TrashCategory, TrashItemDef } from '../types';
import { TRASH_ITEMS } from '../data/trashItems';
import { type TriggerSpeech } from '../data/voicePrompts';
import { playPickSfx, playSuccessSfx } from '../utils/audio';
import {
  createHeadTiltRounds,
  evaluateHeadTiltChoice,
  getShoulderRelativeOffset,
  HEAD_TILT_ROUND_COUNT,
  HEAD_TILT_TRASH_IMAGES,
  headTiltDirectionToCategory,
  HeadTiltSignalDetector,
  median,
} from '../utils/headTiltSorting';
import visionWasmBinaryUrl from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import visionWasmLoaderUrl from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';

type GamePhase = 'intro' | 'playing' | 'feedback' | 'paused' | 'complete';
type CameraState = 'off' | 'requesting' | 'calibrating' | 'ready' | 'error';

interface HeadTiltSortingGameProps {
  onExit: () => void;
  triggerSpeech: TriggerSpeech;
  customMascotUrl: string | null;
  customTrashImages: Record<string, string>;
}

const FEEDBACK_DURATION_MS = 2200;
const CALIBRATION_SAMPLE_COUNT = 20;
const QUESTION_READ_DELAY_MS = 1100;
const CATEGORY_LABELS: Record<TrashCategory, string> = {
  organic: 'Hữu cơ',
  recyclable: 'Tái chế',
};

const cameraErrorMessage = (error: unknown) => {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'Camera chưa được cấp quyền. Bạn có thể thử lại hoặc chơi bằng nút.';
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'Không tìm thấy camera trên thiết bị này. Bé vẫn có thể chơi bằng nút.';
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Camera đang được ứng dụng khác sử dụng. Hãy đóng ứng dụng đó hoặc chơi bằng nút.';
    }
  }
  return 'Chưa thể khởi động camera. Bé có thể thử lại hoặc chơi bằng nút.';
};

export const HeadTiltSortingGame: React.FC<HeadTiltSortingGameProps> = ({
  onExit,
  triggerSpeech,
  customMascotUrl,
  customTrashImages,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [cameraState, setCameraState] = useState<CameraState>('off');
  const [cameraError, setCameraError] = useState('');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [rounds, setRounds] = useState<ReturnType<typeof createHeadTiltRounds>>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [keyboardChoice, setKeyboardChoice] = useState<TrashCategory | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<import('@mediapipe/tasks-vision').PoseLandmarker | null>(null);
  const detectorRef = useRef<HeadTiltSignalDetector | null>(null);
  const calibrationSamplesRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const cameraSessionRef = useRef(0);
  const phaseRef = useRef<GamePhase>('intro');
  const submitChoiceRef = useRef<(choice: TrashCategory) => void>(() => {});
  const inputArmedAtRef = useRef(0);
  const lastInferenceAtRef = useRef(0);
  const currentRound = rounds[roundIndex];
  const currentItem = currentRound?.item;

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 'playing') inputArmedAtRef.current = performance.now() + QUESTION_READ_DELAY_MS;
  }, [phase, roundIndex]);

  const stopCamera = useCallback(() => {
    cameraSessionRef.current++;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    detectorRef.current = null;
    calibrationSamplesRef.current = [];
    setCameraState('off');
    setCalibrationProgress(0);
    setFaceDetected(false);
  }, []);

  useEffect(() => () => {
    cameraSessionRef.current++;
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
    landmarkerRef.current?.close();
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && streamRef.current) stopCamera();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [stopCamera]);

  const beginRounds = useCallback(() => {
    const nextRounds = createHeadTiltRounds(TRASH_ITEMS);
    setRounds(nextRounds);
    setRoundIndex(0);
    setScore(0);
    setFeedback('');
    setKeyboardChoice(null);
    phaseRef.current = 'playing';
    setPhase('playing');
  }, []);

  const beginCameraGame = useCallback(async () => {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera cần một trang HTTPS và trình duyệt hỗ trợ. Bé có thể chơi bằng nút ngay.');
      setCameraState('error');
      return;
    }

    const sessionId = ++cameraSessionRef.current;
    setCameraError('');
    setCameraState('requesting');
    let stream: MediaStream | null = null;
    let landmarker: import('@mediapipe/tasks-vision').PoseLandmarker | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (sessionId !== cameraSessionRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = stream;
      if (!videoRef.current) throw new Error('Không tìm thấy phần xem trước camera.');
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const { PoseLandmarker } = await import('@mediapipe/tasks-vision');
      if (sessionId !== cameraSessionRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      const fileset = {
        wasmLoaderPath: visionWasmLoaderUrl,
        wasmBinaryPath: visionWasmBinaryUrl,
      };
      landmarker = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: `${import.meta.env.BASE_URL}models/pose_landmarker_lite.task`,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.6,
        minPosePresenceConfidence: 0.6,
        minTrackingConfidence: 0.6,
        outputSegmentationMasks: false,
      });
      if (sessionId !== cameraSessionRef.current) {
        landmarker.close();
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      landmarkerRef.current = landmarker;
      calibrationSamplesRef.current = [];
      beginRounds();
      setCameraState('calibrating');
    } catch (error) {
      if (sessionId !== cameraSessionRef.current) {
        landmarker?.close();
        stream?.getTracks().forEach(track => track.stop());
        return;
      }
      landmarker?.close();
      stream?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      landmarkerRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraError(cameraErrorMessage(error));
      setCameraState('error');
    }
  }, [beginRounds]);

  const submitChoice = useCallback((choice: TrashCategory) => {
    if (phaseRef.current !== 'playing' || !currentItem) return;
    phaseRef.current = 'feedback';
    setPhase('feedback');
    setKeyboardChoice(null);
    detectorRef.current?.lockUntilNeutral();
    const isCorrect = evaluateHeadTiltChoice(currentItem, choice);
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      setScore(previous => previous + 1);
      setFeedback(`Chính xác! ${currentItem.nameVi} thuộc nhóm ${CATEGORY_LABELS[currentItem.category]}.`);
      if (soundEnabled) playSuccessSfx();
      if (soundEnabled) triggerSpeech('Tuyệt vời quá! Bé giỏi lắm!', 'correct_great');
    } else {
      setFeedback(`${currentItem.nameVi} thuộc nhóm ${CATEGORY_LABELS[currentItem.category]}. ${currentItem.hint}`);
      if (soundEnabled) playPickSfx();
      if (soundEnabled) triggerSpeech('Ôi nhầm rồi, bạn thử lại nhé!', 'incorrect');
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      if (roundIndex + 1 >= rounds.length) {
        stopCamera();
        phaseRef.current = 'complete';
        setPhase('complete');
        if (soundEnabled) playSuccessSfx();
        if (soundEnabled) triggerSpeech('Tuyệt vời quá! Bé giỏi lắm!', 'correct_great');
        return;
      }
      setRoundIndex(index => index + 1);
      phaseRef.current = 'playing';
      setPhase('playing');
    }, FEEDBACK_DURATION_MS);
  }, [currentItem, roundIndex, rounds.length, soundEnabled, stopCamera, triggerSpeech]);
  submitChoiceRef.current = submitChoice;

  useEffect(() => {
    if (phase !== 'playing' || (cameraState !== 'calibrating' && cameraState !== 'ready')) return;
    let active = true;
    const processFrame = (now: number) => {
      if (!active) return;
      if (document.visibilityState === 'visible' && now - lastInferenceAtRef.current >= 100) {
        const video = videoRef.current;
        const landmarker = landmarkerRef.current;
        if (video && landmarker && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          lastInferenceAtRef.current = now;
          try {
            const result = landmarker.detectForVideo(video, now);
            const landmarks = result.landmarks[0]?.map(point => ({
              x: point.x,
              visibility: point.visibility,
            }));
            const offset = landmarks ? getShoulderRelativeOffset(landmarks) : null;
            setFaceDetected(offset !== null);
            if (cameraState === 'calibrating') {
              if (offset !== null) {
                calibrationSamplesRef.current.push(offset);
                setCalibrationProgress(calibrationSamplesRef.current.length);
              }
              if (calibrationSamplesRef.current.length >= CALIBRATION_SAMPLE_COUNT) {
                const neutralOffset = median(calibrationSamplesRef.current);
                if (neutralOffset !== null) {
                  detectorRef.current = new HeadTiltSignalDetector(neutralOffset);
                  setCameraState('ready');
                }
              }
            } else if (phaseRef.current === 'playing' && now >= inputArmedAtRef.current) {
              const direction = detectorRef.current?.update(offset, now);
              if (direction) {
                submitChoiceRef.current(headTiltDirectionToCategory(direction));
              }
            }
          } catch {
            stopCamera();
            setCameraError('Nhận diện camera bị gián đoạn. Bé có thể tiếp tục chơi bằng nút.');
            setCameraState('error');
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(processFrame);
    };
    animationFrameRef.current = requestAnimationFrame(processFrame);
    return () => {
      active = false;
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [cameraState, phase, stopCamera]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setKeyboardChoice('organic');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setKeyboardChoice('recyclable');
      } else if ((event.key === 'Enter' || event.key === ' ') && keyboardChoice) {
        event.preventDefault();
        submitChoiceRef.current(keyboardChoice);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyboardChoice, phase]);

  useEffect(() => () => {
    if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
  }, [roundIndex]);

  const continueWithButtons = () => {
    stopCamera();
    phaseRef.current = 'playing';
    setPhase('playing');
  };

  const pauseGame = () => {
    stopCamera();
    phaseRef.current = 'paused';
    setPhase('paused');
  };

  const restartGame = () => {
    if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = null;
    beginRounds();
  };

  const imageUrl = currentItem && !failedImages[currentItem.id]
    ? customTrashImages[currentItem.id] || HEAD_TILT_TRASH_IMAGES[currentItem.id]
    : undefined;
  return (
    <main className="absolute inset-0 z-40 flex min-h-0 flex-col overflow-y-auto bg-[#f7f6eb] text-slate-900">
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-emerald-950/15 bg-white/90 px-3 py-2 sm:px-6">
        <button type="button" onClick={onExit} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">
          <ArrowLeft className="h-4 w-4" />
          <span>Về màn chơi chính</span>
        </button>
        <h1 className="hidden text-base font-black text-emerald-950 sm:block">Nghiêng đầu phân loại rác</h1>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSoundEnabled(value => !value)} className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700" aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'} title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}>
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          {phase === 'playing' && (
            <button type="button" onClick={pauseGame} className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700" aria-label="Tạm dừng" title="Tạm dừng">
              <CirclePause className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-4 sm:px-6 sm:py-6">
        {cameraState !== 'off' && cameraState !== 'error' && (
          <div className="mb-4 flex w-full items-center gap-3 self-end sm:max-w-sm">
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-300 bg-slate-900">
              <video ref={videoRef} muted playsInline aria-label="Xem trước camera, hình ảnh chỉ xử lý trên thiết bị" className={`aspect-video w-full scale-x-[-1] object-cover ${previewVisible ? '' : 'opacity-0'}`} />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/75 px-2 py-1 text-[11px] font-bold text-white">
                <span>{cameraState === 'requesting' ? 'Đang kết nối camera' : cameraState === 'calibrating' ? calibrationProgress < 4 ? 'Đang tìm khuôn mặt' : 'Hãy nhìn thẳng để bắt đầu' : !faceDetected ? 'Đang tìm khuôn mặt' : 'Đọc câu hỏi rồi dịch chuyển đầu'}</span>
                {cameraState === 'calibrating' && <span>{Math.min(calibrationProgress, CALIBRATION_SAMPLE_COUNT)}/{CALIBRATION_SAMPLE_COUNT}</span>}
              </div>
            </div>
            {(phase === 'playing' || phase === 'feedback') && (
              <div className="flex shrink-0 flex-col gap-1">
                <button type="button" onClick={() => setPreviewVisible(value => !value)} className="grid size-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" aria-label={previewVisible ? 'Ẩn hình xem trước camera' : 'Hiện hình xem trước camera'} title={previewVisible ? 'Ẩn hình xem trước' : 'Hiện hình xem trước'}>
                  {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button type="button" onClick={stopCamera} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">Tắt camera</button>
              </div>
            )}
          </div>
        )}
        {phase === 'intro' && (
          <section className="my-auto grid items-center gap-8 py-4 md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-64 overflow-hidden rounded-xl border border-emerald-950/15 bg-[#dcebd4] p-6 sm:p-9">
              <div className="absolute inset-0 opacity-30" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(#276749 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-center gap-4">
                  <img src={customMascotUrl || './images/kien-sang-main.png'} alt="Kiến Sáng" className="size-20 rounded-full border-2 border-white bg-white object-contain shadow-sm sm:size-24" />
                  <div>
                    <p className="text-xs font-extrabold uppercase text-emerald-800">Trò chơi mới</p>
                    <h2 className="mt-1 text-2xl font-black leading-tight text-emerald-950 sm:text-4xl">Nghiêng đầu<br />phân loại rác</h2>
                  </div>
                </div>
                <p className="max-w-lg text-sm font-medium leading-relaxed text-emerald-950 sm:text-base">
                  Mỗi lượt có một món rác. Chọn <strong>Hữu cơ</strong> hoặc <strong>Tái chế</strong> bằng nút, bàn phím, hoặc cử động đầu.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-slate-700">Camera chỉ nhận biết chuyển động trên thiết bị, không ghi hoặc gửi hình ảnh. Hãy nhờ người lớn hỗ trợ nếu cần bật camera.</p>
              <button type="button" onClick={() => void beginCameraGame()} disabled={cameraState === 'requesting'} className="flex min-h-14 items-center justify-center gap-3 rounded-lg bg-emerald-800 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-wait disabled:opacity-60">
                <Camera className="h-5 w-5" />
                {cameraState === 'requesting' ? 'Đang bật camera…' : 'Bật camera'}
              </button>
              <button type="button" onClick={beginRounds} className="flex min-h-14 items-center justify-center gap-3 rounded-lg border-2 border-slate-300 bg-white px-5 py-3 text-base font-black text-slate-800 transition hover:border-slate-500 hover:bg-slate-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                <Play className="h-5 w-5" />
                Chơi bằng nút
              </button>
              {cameraState === 'error' && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-950">{cameraError}</p>}
            </div>
          </section>
        )}

        {phase === 'playing' && currentItem && (
          <section className="my-auto flex flex-col gap-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
              <div>
                <p className="text-sm font-bold text-slate-600">Câu {roundIndex + 1}/{rounds.length}</p>
                <p className="mt-1 text-sm font-bold text-emerald-900">Điểm đúng: {score}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200" aria-label={`Tiến độ ${roundIndex + 1} trên ${rounds.length}`}>
                  <div className="h-full bg-emerald-700 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((roundIndex + 1) / rounds.length) * 100}%` }} />
                </div>
                {cameraState === 'ready' && <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900">{faceDetected ? 'Camera đang bật' : 'Đang tìm khuôn mặt'}</span>}
                {cameraState === 'error' && <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-950">Đang chơi bằng nút</span>}
              </div>
            </div>

            <div className="grid items-center gap-4">
              <div className="grid min-h-56 grid-cols-[minmax(0,1fr)_minmax(105px,34vw)] items-center gap-4 rounded-xl border border-slate-300 bg-white p-4 sm:min-h-72 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)] sm:p-7">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Bé hãy phân loại</p>
                  <h2 className="mt-2 break-words text-xl font-black leading-snug text-slate-950 sm:text-3xl">“{currentItem.nameVi}” thuộc nhóm nào?</h2>
                </div>
                <div className="relative grid aspect-square max-h-56 place-items-center overflow-hidden rounded-lg bg-[#f4f2e7] p-3 sm:max-h-64">
                  {currentItem.category === 'organic' ? <Leaf className="absolute h-20 w-20 text-emerald-700/15" aria-hidden="true" /> : <Recycle className="absolute h-20 w-20 text-sky-700/15" aria-hidden="true" />}
                  {imageUrl && <img src={imageUrl} alt={currentItem.nameVi} className="relative z-10 max-h-full max-w-full object-contain" onError={() => setFailedImages(previous => ({ ...previous, [currentItem.id]: true }))} />}
                  {!imageUrl && <div className="relative z-10 text-center"><Sparkles className="mx-auto h-12 w-12 text-emerald-800" /><span className="mt-2 block text-sm font-bold">{currentItem.nameVi}</span></div>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <button type="button" onClick={() => submitChoice('organic')} className={`group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white px-3 py-3 text-center transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 motion-reduce:transform-none motion-reduce:transition-none sm:min-h-28 ${keyboardChoice === 'organic' ? 'border-emerald-700 ring-2 ring-emerald-300' : 'border-emerald-800/35'}`}>
                <Leaf className="h-7 w-7 text-emerald-800" aria-hidden="true" />
                <span className="text-base font-black text-emerald-950 sm:text-lg">Hữu cơ</span>
                <span className="text-xs font-medium text-slate-600">Lá, thức ăn, vỏ quả</span>
              </button>
              <button type="button" onClick={() => submitChoice('recyclable')} className={`group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white px-3 py-3 text-center transition hover:-translate-y-0.5 hover:bg-sky-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transform-none motion-reduce:transition-none sm:min-h-28 ${keyboardChoice === 'recyclable' ? 'border-sky-700 ring-2 ring-sky-300' : 'border-sky-800/35'}`}>
                <Recycle className="h-7 w-7 text-sky-800" aria-hidden="true" />
                <span className="text-base font-black text-sky-950 sm:text-lg">Tái chế</span>
                <span className="text-xs font-medium text-slate-600">Giấy, nhựa, kim loại</span>
              </button>
            </div>
            <p className="min-h-6 text-center text-sm font-semibold text-slate-600">{cameraState === 'ready' ? 'Dịch chuyển đầu sang trái để chọn Hữu cơ, sang phải để chọn Tái chế.' : 'Dùng nút hoặc phím mũi tên trái/phải, rồi nhấn Enter hoặc Space.'}</p>
            {cameraError && <p role="status" className="text-center text-sm font-semibold text-amber-900">{cameraError}</p>}
            {(cameraState === 'ready' || cameraState === 'calibrating') && <button type="button" onClick={stopCamera} className="mx-auto min-h-10 rounded-lg px-4 text-sm font-bold text-slate-600 underline decoration-slate-400 underline-offset-4 hover:text-slate-950">Tắt camera, tiếp tục bằng nút</button>}
          </section>
        )}

        {phase === 'feedback' && currentItem && (
          <section className="my-auto flex flex-col items-center gap-5 py-8 text-center" aria-live="assertive">
            <div className={`grid size-24 place-items-center rounded-full ${lastAnswerCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'} motion-safe:animate-bounce motion-reduce:animate-none`}>
              {feedback.startsWith('Chính xác!') ? <Check className="h-12 w-12" /> : <Recycle className="h-12 w-12" />}
            </div>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black text-emerald-950">{feedback.startsWith('Chính xác!') ? 'Làm tốt lắm!' : 'Mình cùng học nhé!'}</h2>
              <p className="mt-3 text-base font-semibold leading-relaxed text-slate-800">{feedback}</p>
              <p className="mt-3 text-sm font-bold text-slate-600">Đáp án: {CATEGORY_LABELS[currentItem.category]}</p>
            </div>
          </section>
        )}

        {phase === 'paused' && (
          <section className="my-auto flex flex-col items-center gap-4 py-10 text-center">
            <CirclePause className="h-14 w-14 text-emerald-800" />
            <h2 className="text-2xl font-black text-emerald-950">Đã tạm dừng</h2>
            <p className="text-sm text-slate-700">Camera đã tắt. Bé có thể tiếp tục bằng nút.</p>
            <button type="button" onClick={continueWithButtons} className="mt-2 flex min-h-12 items-center gap-2 rounded-lg bg-emerald-800 px-5 font-black text-white hover:bg-emerald-900"><Play className="h-5 w-5" />Tiếp tục chơi</button>
          </section>
        )}

        {phase === 'complete' && (
          <section className="my-auto flex flex-col items-center gap-5 py-8 text-center">
            <div className="grid size-24 place-items-center rounded-full bg-amber-100 text-amber-800"><Sparkles className="h-12 w-12" /></div>
            <div>
              <p className="text-sm font-extrabold uppercase text-emerald-800">Hoàn thành {rounds.length} câu</p>
              <h2 className="mt-2 text-3xl font-black text-emerald-950">Cảm ơn bé đã giúp Trái Đất!</h2>
              <p className="mt-3 text-lg font-bold text-slate-800">Bé trả lời đúng {score}/{rounds.length} câu.</p>
              <p className="mt-2 text-sm text-slate-700">Mỗi lần phân loại đúng là một việc tốt cho môi trường.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={restartGame} className="flex min-h-12 items-center gap-2 rounded-lg bg-emerald-800 px-5 font-black text-white hover:bg-emerald-900"><RotateCcw className="h-4 w-4" />Chơi lại</button>
              <button type="button" onClick={onExit} className="min-h-12 rounded-lg border border-slate-300 bg-white px-5 font-bold text-slate-800 hover:bg-slate-50">Về màn chơi chính</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};