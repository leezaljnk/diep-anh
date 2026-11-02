import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CameraOff,
  Check,
  CirclePause,
  Droplet,
  Eye,
  EyeOff,
  Frown,
  Leaf,
  Recycle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { TrashCategory } from '../types';
import { TRASH_ITEMS } from '../data/trashItems';
import { playErrorSfx, playSuccessSfx } from '../utils/audio';
import {
  createHeadTiltRounds,
  evaluateHeadTiltChoice,
  getHeadRollRadians,
  HEAD_TILT_CALIBRATION_SAMPLE_COUNT,
  HEAD_TILT_ENTER_RADIANS,
  HEAD_TILT_EXIT_RADIANS,
  HEAD_TILT_TRASH_IMAGES,
  headTiltDirectionToCategory,
  isHeadTiltCameraReady,
  HeadTiltNeutralCalibration,
  HeadTiltSignalDetector,
  type HeadTiltCameraState,
  type HeadTiltSignalStatus,
} from '../utils/headTiltSorting';
import visionWasmBinaryUrl from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import visionWasmLoaderUrl from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';

type GamePhase = 'intro' | 'playing' | 'feedback' | 'paused' | 'complete';

interface HeadTiltSortingGameProps {
  onExit: () => void;
  customMascotUrl: string | null;
  customTrashImages: Record<string, string>;
}

const FEEDBACK_DURATION_MS = 4000;
const QUESTION_READ_DELAY_MS = 1100;
const CATEGORY_LABELS: Record<TrashCategory, string> = {
  organic: 'Hữu cơ',
  recyclable: 'Tái chế',
};

const cameraErrorMessage = (error: unknown) => {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'Camera chưa được cấp quyền. Hãy cấp quyền camera rồi thử lại.';
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'Không tìm thấy camera. Hãy kết nối camera hoặc dùng thiết bị khác.';
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Camera đang được ứng dụng khác sử dụng. Hãy đóng ứng dụng đó rồi thử lại.';
    }
  }
  return 'Chưa thể khởi động camera. Hãy kiểm tra camera rồi thử lại.';
};

export const HeadTiltSortingGame: React.FC<HeadTiltSortingGameProps> = ({
  onExit,
  customMascotUrl,
  customTrashImages,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [cameraState, setCameraState] = useState<HeadTiltCameraState>('off');
  const [cameraError, setCameraError] = useState('');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastChoice, setLastChoice] = useState<TrashCategory | null>(null);
  const [rounds, setRounds] = useState<ReturnType<typeof createHeadTiltRounds>>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [trackingStatus, setTrackingStatus] = useState<HeadTiltSignalStatus | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const celebrationCanvasRef = useRef<HTMLCanvasElement>(null);
  const feedbackIconRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<import('@mediapipe/tasks-vision').PoseLandmarker | null>(null);
  const detectorRef = useRef<HeadTiltSignalDetector | null>(null);
  const calibrationRef = useRef<HeadTiltNeutralCalibration | null>(null);
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

  useEffect(() => {
    if (phase !== 'feedback' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (lastAnswerCorrect && celebrationCanvasRef.current) {
      const celebrate = confetti.create(celebrationCanvasRef.current, { resize: true });
      const options = {
        particleCount: 65,
        spread: 75,
        startVelocity: 32,
        ticks: 160,
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#fb7185', '#ffffff'],
        disableForReducedMotion: true,
      };
      void celebrate({ ...options, angle: 60, origin: { x: 0.15, y: 0.65 } });
      void celebrate({ ...options, angle: 120, origin: { x: 0.85, y: 0.65 } });
      return () => celebrate.reset();
    }
    const icon = feedbackIconRef.current;
    if (!icon) return;
    const sadAnimation = icon.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(8px) rotate(-8deg)', offset: 0.4 },
      { transform: 'translateY(3px) rotate(4deg)', offset: 0.7 },
      { transform: 'translateY(0) rotate(0deg)' },
    ], { duration: 1000, easing: 'ease-in-out' });
    const tearAnimations = Array.from(icon.querySelectorAll('[data-feedback-tear]')).map((tear, index) => tear.animate([
      { transform: 'translateY(-4px)', opacity: 0 },
      { opacity: 0.8, offset: 0.2 },
      { transform: 'translateY(22px)', opacity: 0 },
    ], { duration: 1200, delay: index * 220, iterations: 2, easing: 'ease-in' }));
    return () => {
      sadAnimation.cancel();
      tearAnimations.forEach(animation => animation.cancel());
    };
  }, [phase, lastAnswerCorrect]);

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
    calibrationRef.current = null;
    setCameraState('off');
    setCalibrationProgress(0);
    setFaceDetected(false);
    setTrackingStatus(null);
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
      if (document.visibilityState === 'hidden') stopCamera();
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
    setLastChoice(null);
    phaseRef.current = 'playing';
    setPhase('playing');
  }, []);

  const beginCameraGame = useCallback(async (newGame = false) => {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera cần trang HTTPS và trình duyệt hỗ trợ. Hãy mở game bằng trình duyệt có camera.');
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
      calibrationRef.current = new HeadTiltNeutralCalibration();
      setCalibrationProgress(0);
      if (phaseRef.current === 'intro' || newGame) {
        beginRounds();
      } else if (phaseRef.current === 'paused') {
        phaseRef.current = 'playing';
        setPhase('playing');
      }
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
    if (phaseRef.current !== 'playing' || !currentItem || !isHeadTiltCameraReady(cameraState, streamRef.current?.active ?? false)) return;
    phaseRef.current = 'feedback';
    setPhase('feedback');
    detectorRef.current?.lockUntilNeutral();
    if (detectorRef.current) setTrackingStatus(detectorRef.current.status);
    const isCorrect = evaluateHeadTiltChoice(currentItem, choice);
    setLastChoice(choice);
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      setScore(previous => previous + 1);
      setFeedback(`Chính xác! ${currentItem.nameVi} thuộc nhóm ${CATEGORY_LABELS[currentItem.category]}.`);
      if (soundEnabled) playSuccessSfx();
    } else {
      setFeedback(`Chưa đúng rồi. ${currentItem.nameVi} thuộc nhóm ${CATEGORY_LABELS[currentItem.category]}. ${currentItem.hint}`);
      if (soundEnabled) playErrorSfx();
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      if (roundIndex + 1 >= rounds.length) {
        stopCamera();
        phaseRef.current = 'complete';
        setPhase('complete');
        return;
      }
      setRoundIndex(index => index + 1);
      phaseRef.current = 'playing';
      setPhase('playing');
    }, FEEDBACK_DURATION_MS);
  }, [cameraState, currentItem, roundIndex, rounds.length, soundEnabled, stopCamera]);
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
            const landmarks = result.landmarks[0];
            const offset = landmarks ? getHeadRollRadians(landmarks, video.videoWidth, video.videoHeight) : null;
            setFaceDetected(offset !== null);
            if (cameraState === 'calibrating') {
              const neutralOffset = calibrationRef.current?.update(offset, now) ?? null;
              setCalibrationProgress(calibrationRef.current?.sampleCount ?? 0);
              if (neutralOffset !== null) {
                detectorRef.current = new HeadTiltSignalDetector(neutralOffset, HEAD_TILT_ENTER_RADIANS, HEAD_TILT_EXIT_RADIANS);
                detectorRef.current.lockUntilNeutral();
                setTrackingStatus(detectorRef.current.status);
                inputArmedAtRef.current = now + QUESTION_READ_DELAY_MS;
                setCameraState('ready');
              }
            } else if (phaseRef.current === 'playing') {
              const direction = detectorRef.current?.update(offset, now, now >= inputArmedAtRef.current);
              if (detectorRef.current) setTrackingStatus(detectorRef.current.status);
              if (direction) {
                submitChoiceRef.current(headTiltDirectionToCategory(direction));
              }
            }
          } catch {
            stopCamera();
            setCameraError('Nhận diện bị gián đoạn. Hãy bật lại camera để tiếp tục.');
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

  useEffect(() => () => {
    if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
  }, [roundIndex]);

  const pauseGame = () => {
    stopCamera();
    phaseRef.current = 'paused';
    setPhase('paused');
  };

  const restartGame = () => {
    if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = null;
    phaseRef.current = 'intro';
    setPhase('intro');
    void beginCameraGame(true);
  };

  const recalibrateCamera = () => {
    detectorRef.current = null;
    calibrationRef.current = new HeadTiltNeutralCalibration();
    setCalibrationProgress(0);
    setTrackingStatus(null);
    setCameraState('calibrating');
  };

  const canAnswer = isHeadTiltCameraReady(cameraState, streamRef.current?.active ?? false);
  const cameraCandidate = trackingStatus?.direction ? headTiltDirectionToCategory(trackingStatus.direction) : null;
  const cameraTiltValue = Math.max(-1, Math.min(1, -(trackingStatus?.offset ?? 0) / HEAD_TILT_ENTER_RADIANS));
  const imageUrl = currentItem && !failedImages[currentItem.id]
    ? customTrashImages[currentItem.id] || HEAD_TILT_TRASH_IMAGES[currentItem.id]
    : undefined;
  return (
    <main className="absolute inset-0 z-40 flex max-h-dvh min-h-0 flex-col overflow-hidden bg-white text-slate-900">
      <canvas ref={celebrationCanvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-50 h-full w-full" />
      <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-emerald-950/15 bg-white/90 px-2 py-1 lg:min-h-14 lg:px-6 lg:py-2">
        <button type="button" onClick={onExit} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-xs font-bold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 lg:px-3 lg:text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span>Về màn chơi chính</span>
        </button>
        <h1 className="hidden text-base font-black text-emerald-950 lg:block">Nghiêng đầu phân loại rác</h1>
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

      <div className="grid min-h-0 w-full flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 p-2 sm:grid-cols-[minmax(220px,2fr)_minmax(0,3fr)] sm:grid-rows-[minmax(0,1fr)] sm:gap-3 sm:p-3 lg:gap-6 lg:px-6 lg:py-4 xl:px-8">
        <div className="contents sm:flex sm:min-h-0 sm:min-w-0 sm:flex-col sm:overflow-y-auto lg:pr-1" aria-label="Câu hỏi và đáp án">
        {phase === 'intro' && (
          <section className="col-start-1 row-start-1 grid items-center gap-3 py-1 sm:my-auto lg:gap-6 lg:py-4">
            <div className="py-1 lg:py-3">
              <div className="flex h-full flex-col justify-between gap-3 lg:gap-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <img src={customMascotUrl || './images/kien-sang-main.png'} alt="Kiến Sáng" className="size-12 rounded-full border-2 border-white bg-white object-contain shadow-sm lg:size-24" />
                  <div>
                    <p className="hidden text-xs font-extrabold uppercase text-emerald-800 lg:block">Trò chơi mới</p>
                    <h2 className="text-xl font-black leading-tight text-emerald-950 lg:mt-1 lg:text-4xl">Nghiêng đầu<br />phân loại rác</h2>
                  </div>
                </div>
                <p className="max-w-lg text-sm font-medium leading-snug text-emerald-950 lg:text-base lg:leading-relaxed">
                  Bật camera để phân loại <strong>Hữu cơ</strong> hoặc <strong>Tái chế</strong> bằng cử động đầu hoặc chạm đáp án.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs leading-relaxed text-slate-700 lg:text-sm">Camera xử lý trên thiết bị, không ghi hoặc gửi hình ảnh. Nhờ người lớn hỗ trợ khi cần.</p>
              <button type="button" onClick={() => void beginCameraGame()} disabled={cameraState === 'requesting'} className="flex min-h-11 touch-manipulation items-center justify-center gap-3 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-wait disabled:opacity-60 lg:min-h-14 lg:px-5 lg:py-3 lg:text-base">
                <Camera className="h-5 w-5" />
                {cameraState === 'requesting' ? 'Đang bật camera…' : 'Bật camera'}
              </button>
            </div>
          </section>
        )}

        {phase === 'playing' && currentItem && (
          <section className="contents sm:my-auto sm:flex sm:flex-col sm:gap-3 lg:gap-4" aria-live="polite">
            <div className="col-start-1 row-start-1 flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-1 lg:gap-3 lg:pb-3">
              <div className="flex items-center gap-3 lg:block">
                <p className="text-xs font-bold text-slate-600 lg:text-sm">Câu {roundIndex + 1}/{rounds.length}</p>
                <p className="text-xs font-bold text-emerald-900 lg:mt-1 lg:text-sm">Điểm đúng: {score}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 lg:w-28" aria-label={`Tiến độ ${roundIndex + 1} trên ${rounds.length}`}>
                  <div className="h-full bg-emerald-700 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((roundIndex + 1) / rounds.length) * 100}%` }} />
                </div>
                {cameraState === 'ready' && <span className="hidden rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 lg:inline-flex">{faceDetected ? 'Camera đang bật' : 'Đang tìm khuôn mặt'}</span>}
                {(cameraState === 'off' || cameraState === 'error') && <span className="hidden rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-950 lg:inline-flex">Cần bật camera</span>}
              </div>
            </div>

            <div className="grid items-center gap-2 lg:gap-4">
              <div className="grid grid-cols-[minmax(0,1fr)_72px] items-center gap-2 py-1 lg:min-h-72 lg:grid-cols-[minmax(0,1fr)_minmax(100px,42%)] lg:gap-4 lg:py-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase text-sky-800 lg:text-xs">Bé hãy phân loại</p>
                  <h2 className="mt-1 break-words text-lg font-black leading-snug text-slate-950 lg:mt-2 lg:text-3xl">“{currentItem.nameVi}” thuộc nhóm nào?</h2>
                </div>
                <div className="relative grid aspect-square max-h-20 w-full max-w-20 place-items-center justify-self-end overflow-hidden rounded-lg bg-emerald-50 p-1 lg:max-h-80 lg:max-w-80 lg:p-3">
                  {currentItem.category === 'organic' ? <Leaf className="absolute size-8 text-emerald-700/15 lg:size-20" aria-hidden="true" /> : <Recycle className="absolute size-8 text-sky-700/15 lg:size-20" aria-hidden="true" />}
                  {imageUrl && <img src={imageUrl} alt={currentItem.nameVi} className="absolute inset-0 z-10 h-full w-full object-contain p-1 lg:p-3" onError={() => setFailedImages(previous => ({ ...previous, [currentItem.id]: true }))} />}
                  {!imageUrl && <div className="relative z-10 text-center"><Sparkles className="mx-auto size-6 text-emerald-800 lg:size-12" /><span className="mt-2 hidden text-sm font-bold lg:block">{currentItem.nameVi}</span></div>}
                </div>
              </div>
            </div>

            </div>
            <div role="group" aria-label="Đáp án" className="col-start-1 row-start-3 grid grid-cols-2 gap-2 lg:gap-5">
              <button type="button" disabled={!canAnswer} onClick={() => submitChoice('organic')} className={`group flex min-h-14 touch-manipulation items-center justify-center gap-2 rounded-lg border-2 bg-emerald-50 px-2 py-2 text-center transition enabled:hover:-translate-y-0.5 enabled:hover:bg-emerald-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none lg:min-h-28 lg:flex-col lg:px-3 lg:py-3 ${cameraCandidate === 'organic' ? 'border-emerald-700 ring-2 ring-emerald-300' : 'border-emerald-800/35'}`}>
                <Leaf className="size-5 text-emerald-800 lg:size-7" aria-hidden="true" />
                <span className="text-sm font-black text-emerald-950 lg:text-lg">Hữu cơ</span>
                <span className="hidden text-xs font-medium text-slate-600 lg:block">Lá, thức ăn, vỏ quả</span>
              </button>
              <button type="button" disabled={!canAnswer} onClick={() => submitChoice('recyclable')} className={`group flex min-h-14 touch-manipulation items-center justify-center gap-2 rounded-lg border-2 bg-sky-50 px-2 py-2 text-center transition enabled:hover:-translate-y-0.5 enabled:hover:bg-sky-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none lg:min-h-28 lg:flex-col lg:px-3 lg:py-3 ${cameraCandidate === 'recyclable' ? 'border-sky-700 ring-2 ring-sky-300' : 'border-sky-800/35'}`}>
                <Recycle className="size-5 text-sky-800 lg:size-7" aria-hidden="true" />
                <span className="text-sm font-black text-sky-950 lg:text-lg">Tái chế</span>
                <span className="hidden text-xs font-medium text-slate-600 lg:block">Giấy, nhựa, kim loại</span>
              </button>
            </div>
          </section>
        )}

        {phase === 'feedback' && currentItem && (
          <section className="col-start-1 row-start-1 flex flex-col items-center gap-2 py-1 text-center sm:my-auto lg:gap-5 lg:py-8" aria-live="assertive">
            <div ref={feedbackIconRef} aria-hidden="true" className={`relative grid size-12 place-items-center rounded-full lg:size-24 ${lastAnswerCorrect ? 'bg-emerald-100 text-emerald-800 motion-safe:animate-bounce motion-reduce:animate-none' : 'bg-sky-100 text-sky-800'}`}>
              {lastAnswerCorrect ? <Check className="size-7 lg:size-12" /> : <>
                <Frown className="size-8 lg:size-14" />
                <Droplet data-feedback-tear className="absolute left-1 top-6 size-3 fill-sky-400 text-sky-500 opacity-0 lg:left-4 lg:top-12 lg:size-4" />
                <Droplet data-feedback-tear className="absolute right-1 top-6 size-3 fill-sky-400 text-sky-500 opacity-0 lg:right-4 lg:top-12 lg:size-4" />
              </>}
            </div>
            <div className="max-w-2xl">
              <h2 className="text-lg font-black text-emerald-950 lg:text-2xl">{lastAnswerCorrect ? 'Làm tốt lắm!' : 'Mình cùng học nhé!'}</h2>
              {lastChoice && <p className="mt-1 text-xs font-bold text-slate-600 lg:mt-3 lg:text-sm">Bé đã chọn: {CATEGORY_LABELS[lastChoice]}</p>}
              <p className="mt-1 text-sm font-semibold leading-snug text-slate-800 lg:mt-3 lg:text-base lg:leading-relaxed">{feedback}</p>
              <p className="mt-1 text-xs font-bold text-slate-600 lg:mt-3 lg:text-sm">Đáp án: {CATEGORY_LABELS[currentItem.category]}</p>
              {!lastAnswerCorrect && <p className="mt-1 text-xs font-semibold text-sky-800 lg:mt-3 lg:text-sm">Không sao, mình thử câu tiếp nhé!</p>}
            </div>
          </section>
        )}

        {phase === 'paused' && (
          <section className="col-start-1 row-start-1 flex flex-col items-center gap-2 py-2 text-center sm:my-auto lg:gap-4 lg:py-10">
            <CirclePause className="size-8 text-emerald-800 lg:size-14" />
            <h2 className="text-xl font-black text-emerald-950 lg:text-2xl">Đã tạm dừng</h2>
            <p className="text-sm text-slate-700">Bật lại camera để tiếp tục câu hiện tại.</p>
            <button type="button" onClick={() => void beginCameraGame()} disabled={cameraState === 'requesting'} className="mt-2 flex min-h-12 items-center gap-2 rounded-lg bg-emerald-800 px-5 font-black text-white hover:bg-emerald-900 disabled:opacity-50"><Camera className="h-5 w-5" />{cameraState === 'requesting' ? 'Đang bật camera…' : 'Bật lại camera'}</button>
          </section>
        )}

        {phase === 'complete' && (
          <section className="col-start-1 row-span-3 row-start-1 my-auto flex flex-col items-center gap-3 py-2 text-center sm:row-span-1 lg:gap-5 lg:py-8">
            <div className="grid size-24 place-items-center rounded-full bg-amber-100 text-amber-800"><Sparkles className="h-12 w-12" /></div>
            <div>
              <p className="text-sm font-extrabold uppercase text-emerald-800">Hoàn thành {rounds.length} câu</p>
              <h2 className="mt-2 text-2xl font-black text-emerald-950 lg:text-3xl">Cảm ơn bé đã giúp Trái Đất!</h2>
              <p className="mt-3 text-lg font-bold text-slate-800">Bé trả lời đúng {score}/{rounds.length} câu.</p>
              <p className="mt-2 text-sm text-slate-700">Mỗi lần phân loại đúng là một việc tốt cho môi trường.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={restartGame} disabled={cameraState === 'requesting'} className="flex min-h-12 items-center gap-2 rounded-lg bg-emerald-800 px-5 font-black text-white hover:bg-emerald-900 disabled:opacity-50"><RotateCcw className="h-4 w-4" />{cameraState === 'requesting' ? 'Đang bật camera…' : 'Chơi lại'}</button>
              <button type="button" onClick={onExit} className="min-h-12 rounded-lg border border-slate-300 bg-white px-5 font-bold text-slate-800 hover:bg-slate-50">Về màn chơi chính</button>
            </div>
          </section>
        )}
        </div>
        <aside aria-label="Camera" className={`col-start-1 row-start-2 min-h-0 min-w-0 flex-col gap-1 sm:col-start-2 sm:row-start-1 sm:h-full sm:border-l sm:border-slate-200 sm:pl-3 lg:gap-3 lg:pl-6 ${phase === 'complete' ? 'hidden sm:flex' : 'flex'}`}>
          <div className="hidden min-h-10 shrink-0 flex-wrap items-center justify-between gap-2 lg:flex">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-800"><Camera className="h-5 w-5 text-sky-700" />Camera</h2>
            <span className={`inline-flex items-center gap-2 text-xs font-bold ${cameraState === 'off' || cameraState === 'error' ? 'text-slate-500' : 'text-emerald-800'}`}>
              <span aria-hidden="true" className={`size-2 rounded-full ${cameraState === 'off' || cameraState === 'error' ? 'bg-slate-400' : 'bg-emerald-600'}`} />
              {cameraState === 'off' ? 'Đã tắt' : cameraState === 'error' ? 'Chưa kết nối' : cameraState === 'requesting' ? 'Đang kết nối' : 'Đang bật'}
            </span>
          </div>
          <div className={`relative min-h-0 w-full flex-1 overflow-hidden rounded-lg ${cameraState === 'off' || cameraState === 'error' || !previewVisible ? 'bg-sky-50' : 'bg-slate-950'}`} style={cameraState === 'off' || cameraState === 'error' || !previewVisible ? { backgroundImage: 'radial-gradient(#bae6fd 1px, transparent 1px)', backgroundSize: '20px 20px' } : undefined}>
            <video ref={videoRef} muted playsInline aria-label="Xem trước camera, hình ảnh chỉ xử lý trên thiết bị" className={`absolute inset-0 h-full w-full scale-x-[-1] object-contain ${previewVisible && cameraState !== 'off' && cameraState !== 'error' ? '' : 'opacity-0'}`} />
            {(cameraState === 'off' || cameraState === 'error' || !previewVisible) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center lg:gap-4 lg:p-5">
                <img src={customMascotUrl || './images/kien-sang-main.png'} alt="Kiến Sáng" className="size-16 object-contain lg:size-40" />
                <p className="text-xs font-bold text-sky-950 lg:text-sm">{cameraState === 'error' ? 'Camera chưa sẵn sàng' : cameraState === 'off' ? 'Camera đã tắt' : 'Đã ẩn hình xem trước'}</p>
              </div>
            )}
          </div>
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(40px,auto)_20px] items-center gap-x-2 gap-y-1 lg:min-h-28 lg:grid-rows-[minmax(40px,auto)_56px] lg:gap-3">
          <div className="col-start-1 row-start-1 flex min-h-10 min-w-0 items-center justify-between gap-2 lg:gap-3">
            <p role={cameraState === 'error' ? 'alert' : 'status'} className="min-w-0 text-xs font-semibold leading-4 text-slate-600 lg:text-sm">
              {cameraState === 'off' ? 'Cần bật camera để chơi' : cameraState === 'error' ? cameraError : cameraState === 'requesting' ? 'Đang kết nối camera…' : cameraState === 'calibrating' ? !faceDetected ? 'Đang tìm khuôn mặt' : 'Giữ đầu thẳng và ổn định để hiệu chỉnh' : !faceDetected ? 'Đưa khuôn mặt vào khung hình' : phase === 'feedback' ? 'Đã chọn đáp án' : trackingStatus?.needsNeutral ? 'Đưa đầu thẳng về giữa' : !trackingStatus?.enabled ? 'Đang chuẩn bị câu hỏi' : cameraCandidate ? `Đang chọn: ${CATEGORY_LABELS[cameraCandidate]}` : 'Camera sẵn sàng'}
            </p>
            {cameraState === 'calibrating' && <span className="shrink-0 text-sm font-bold text-sky-800">{calibrationProgress}/{HEAD_TILT_CALIBRATION_SAMPLE_COUNT}</span>}
          </div>
          {cameraState === 'ready' && (
            <div className="col-span-2 row-start-2 flex min-h-0 flex-col gap-1 lg:gap-2" aria-label="Tín hiệu nghiêng đầu">
              <div className="hidden items-center justify-between gap-3 text-xs font-bold lg:flex">
                <span className="flex items-center gap-1 text-emerald-800"><ArrowLeft className="size-4" />Hữu cơ</span>
                <span className="flex items-center gap-1 text-sky-800">Tái chế<ArrowRight className="size-4" /></span>
              </div>
              <div role="meter" aria-label="Hướng nghiêng đầu" aria-valuemin={-1} aria-valuemax={1} aria-valuenow={cameraTiltValue} className="relative h-3 rounded-full bg-slate-100 lg:h-5">
                <span className="absolute bottom-0 left-1/2 top-0 w-px bg-slate-400" aria-hidden="true" />
                <span className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full lg:size-3 ${faceDetected ? 'bg-emerald-700' : 'bg-slate-400'}`} style={{ left: `${50 + cameraTiltValue * 43}%` }} aria-hidden="true" />
              </div>
              <div role="progressbar" aria-label="Tiến độ giữ nghiêng" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((trackingStatus?.progress ?? 0) * 100)} className="h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-sky-600" style={{ width: `${(trackingStatus?.progress ?? 0) * 100}%` }} />
              </div>
            </div>
          )}
          {(cameraState === 'off' || cameraState === 'error') && phase === 'playing' && (
            <button type="button" onClick={() => void beginCameraGame()} className="col-start-2 row-start-1 flex min-h-10 touch-manipulation items-center justify-center gap-2 rounded-lg bg-emerald-800 px-2 py-2 text-xs font-bold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 lg:px-4 lg:text-sm"><Camera className="h-4 w-4" />Bật lại camera</button>
          )}
          {cameraState !== 'off' && cameraState !== 'error' && (
            <div className="col-start-2 row-start-1 flex flex-nowrap items-center gap-1 lg:gap-2">
              <button type="button" onClick={() => setPreviewVisible(value => !value)} className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700" aria-label={previewVisible ? 'Ẩn hình xem trước camera' : 'Hiện hình xem trước camera'} title={previewVisible ? 'Ẩn hình xem trước' : 'Hiện hình xem trước'}>
                {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {cameraState === 'ready' && phase === 'playing' && <button type="button" onClick={recalibrateCamera} className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700" aria-label="Hiệu chỉnh camera" title="Hiệu chỉnh camera"><RotateCcw className="h-4 w-4" /></button>}
              <button type="button" onClick={stopCamera} aria-label="Tắt camera" title="Tắt camera" className="flex min-h-10 min-w-10 touch-manipulation items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700 lg:px-3"><CameraOff className="h-4 w-4" /><span className="hidden lg:inline">Tắt camera</span></button>
            </div>
          )}
          </div>
        </aside>
      </div>
    </main>
  );
};