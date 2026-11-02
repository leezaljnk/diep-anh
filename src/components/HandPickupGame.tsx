import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, CameraOff, Check, Eye, EyeOff, Hand, Leaf, LoaderCircle, RotateCcw, Star, Trash2, Volume2, VolumeX, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import visionWasmBinaryUrl from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import visionWasmLoaderUrl from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';
import {
  canPickUp, createHandPickupRounds, getHandDropCategory, getHandOpenness, HAND_DROP_ZONES,
  HAND_PICKUP_COUNT, HAND_PICKUP_MAX_COUNT, HandGestureDetector, isValidHandPickupCount, mapHandPoint, PICKUP_ORIGIN, stepHandPickup,
  type HandGesture, type HandPickupRound, type HandPickupState, type HandPoint,
} from '../utils/handPickup';
import { playCountdownSfx, playErrorSfx, playPickSfx, playSuccessSfx, speakKienSang, stopKienSangSpeech } from '../utils/audio';
import type { TrashCategory, VoiceClips } from '../types';
import './HandPickupGame.css';

type Phase = 'intro' | 'playing' | 'feedback' | 'complete';
type CameraState = 'off' | 'loading' | 'ready' | 'error';
const EMPTY_PICKUP: HandPickupState = { holding: false, gesture: null, result: null };
const LABELS: Record<TrashCategory, string> = { organic: 'Hữu cơ', recyclable: 'Vô cơ' };

function cameraError(error: unknown): string {
  const name = error instanceof Error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'Camera chưa được cấp quyền. Hãy cho phép camera trong cài đặt trình duyệt rồi thử lại.';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'Không tìm thấy camera. Hãy kết nối camera rồi thử lại.';
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'Camera đang bận. Hãy đóng ứng dụng khác đang dùng camera rồi thử lại.';
  return 'Chưa thể mở camera hoặc tải bộ nhận diện tay. Hãy kiểm tra kết nối và thử lại.';
}

function GameImage({ src, fallback, alt, className }: { src: string; fallback: React.ReactNode; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className={className} role="img" aria-label={alt}>{fallback}</span>
    : <img src={src} alt={alt} className={className} draggable={false} onError={() => setFailed(true)} />;
}

function HandIllustration({ closed = false }: { closed?: boolean }) {
  return (
    <span className={`hand-illustration ${closed ? 'grip' : 'open'}`} aria-hidden="true">
      <svg viewBox="0 0 96 112" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <g stroke="#925b32" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {closed ? <>
            <path fill="#ffe5ac" d="M28 89C18 82 15 72 17 60V49C17 43 21 40 26 40 30 40 33 42 35 45V37C35 32 39 29 43 29S50 31 51 35C52 30 56 28 61 29S68 33 68 38C71 35 75 35 79 38S84 45 83 50V65C83 83 72 95 52 95 42 96 34 94 28 89Z" />
            <path d="M35 45V55M51 36V52M68 39V54" strokeWidth="3.2" />
            <path fill="#ffe5ac" d="M20 58C16 54 17 48 22 47S30 48 33 52L46 63C50 66 51 72 47 76S38 78 34 75L26 69" strokeWidth="3.5" />
            <path d="M42 86Q53 90 64 84" stroke="#f0c383" strokeWidth="3" />
          </> : <>
            <path fill="#ffe5ac" d="M29 88C19 84 14 75 11 65L8 55C6 50 8 45 12 44S20 45 23 49L27 55V30C27 25 30 22 34 22S41 25 41 30V19C41 14 44 11 48 11S55 14 55 19V26C55 21 58 18 62 18S69 21 69 26V36C69 31 72 28 76 28S83 31 83 36V61C83 80 71 93 52 95 43 96 35 94 29 88Z" />
            <path d="M41 30V50M55 26V48M69 36V51M27 55Q37 57 37 68" strokeWidth="3.2" />
            <path d="M43 85Q53 89 63 83" stroke="#f0c383" strokeWidth="3" />
          </>}
        </g>
      </svg>
    </span>
  );
}

export function HandPickupGame({ onExit, customMascotUrl, voiceClips }: { onExit: () => void; customMascotUrl: string | null; voiceClips: VoiceClips }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cameraState, setCameraState] = useState<CameraState>('off');
  const [error, setError] = useState('');
  const [rounds, setRounds] = useState<HandPickupRound[]>([]);
  const [itemCount, setItemCount] = useState(String(HAND_PICKUP_COUNT));
  const validItemCount = isValidHandPickupCount(Number(itemCount));
  const [completed, setCompleted] = useState(0);
  const [pointer, setPointer] = useState<HandPoint | null>(null);
  const [gesture, setGesture] = useState<HandGesture | null>(null);
  const [holding, setHolding] = useState(false);
  const [feedback, setFeedback] = useState<HandPickupState['result']>(null);
  const [message, setMessage] = useState('');
  const [sound, setSound] = useState(true);
  const [preview, setPreview] = useState(true);
  const [confirmExit, setConfirmExit] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celebrationRef = useRef<ReturnType<typeof confetti.create> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<import('@mediapipe/tasks-vision').HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  const detectorRef = useRef(new HandGestureDetector());
  const pickupRef = useRef<HandPickupState>({ ...EMPTY_PICKUP });
  const pointRef = useRef<HandPoint | null>(null);
  const phaseRef = useRef<Phase>('intro');
  const roundsRef = useRef<HandPickupRound[]>([]);
  const completedRef = useRef(0);
  const soundRef = useRef(true);
  const lastActionRef = useRef(0);
  const resumeOpenRef = useRef(false);
  const currentItem = rounds[completed];
  const totalItems = rounds.length || (validItemCount ? Number(itemCount) : HAND_PICKUP_COUNT);

  function triggerSpeech(text: string, voiceId: string) {
    setMessage(text);
    if (soundRef.current) speakKienSang(text, voiceClips[voiceId]);
  }

  function resetTracking() {
    detectorRef.current.reset();
    pickupRef.current = { ...EMPTY_PICKUP };
    pointRef.current = null;
    resumeOpenRef.current = false;
    setPointer(null);
    setGesture(null);
    setHolding(false);
  }

  function releaseResources() {
    sessionRef.current++;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    animationRef.current = null;
    timerRef.current = null;
    celebrationRef.current?.reset();
    const model = modelRef.current;
    modelRef.current = null;
    model?.close();
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function stopCamera() {
    releaseResources();
    resetTracking();
    setCameraState('off');
    stopKienSangSpeech();
    if (phaseRef.current === 'feedback') {
      phaseRef.current = completedRef.current === roundsRef.current.length ? 'complete' : 'playing';
      setPhase(phaseRef.current);
      setCompleted(completedRef.current);
      setFeedback(null);
    }
  }

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') stopCamera();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseResources();
      stopKienSangSpeech();
    };
  }, []);

  function finishDrop(result: NonNullable<HandPickupState['result']>, point: HandPoint) {
    phaseRef.current = 'feedback';
    setPhase('feedback');
    setFeedback(result);
    lastActionRef.current = performance.now();
    if (result === 'correct') {
      completedRef.current++;
      if (soundRef.current) playSuccessSfx();
      triggerSpeech('Tuyệt vời quá! Bé giỏi lắm!', 'correct_great');
      if (canvasRef.current) {
        celebrationRef.current ??= confetti.create(canvasRef.current, { resize: true });
        void celebrationRef.current({ particleCount: 45, spread: 65, origin: point, disableForReducedMotion: true });
      }
    } else {
      if (soundRef.current) playErrorSfx();
      if (result === 'miss') triggerSpeech('Chưa tới thùng rồi, con thử lại nhé!', 'hand_pickup_miss');
      else if (roundsRef.current[completedRef.current].category === 'organic') {
        triggerSpeech('Thử lại nhé! Món này thuộc nhóm Hữu cơ.', 'hand_pickup_retry_organic');
      } else triggerSpeech('Thử lại nhé! Món này thuộc nhóm Vô cơ.', 'hand_pickup_retry_inorganic');
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setCompleted(completedRef.current);
      setFeedback(null);
      resetTracking();
      if (completedRef.current === roundsRef.current.length) {
        releaseResources();
        setCameraState('off');
        phaseRef.current = 'complete';
        setPhase('complete');
        triggerSpeech('Tuyệt vời! Con đã dọn sạch tất cả món rác!', 'hand_pickup_victory');
      } else {
        phaseRef.current = 'playing';
        setPhase('playing');
      }
    }, 1100);
  }

  async function startCamera(newGame = false) {
    if (!validItemCount) return;
    stopCamera();
    setConfirmExit(false);
    setError('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('error');
      setError('Camera cần HTTPS hoặc localhost. Hãy mở trò chơi trong trình duyệt hỗ trợ camera.');
      return;
    }
    if (soundRef.current) playCountdownSfx(0);
    setCameraState('loading');
    const session = sessionRef.current;
    let stream: MediaStream | null = null;
    let model: import('@mediapipe/tasks-vision').HandLandmarker | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } });
      if (session !== sessionRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error('Camera preview unavailable');
      video.srcObject = stream;
      await video.play();
      if (session !== sessionRef.current) return;
      const { HandLandmarker } = await import('@mediapipe/tasks-vision');
      if (session !== sessionRef.current) return;
      model = await HandLandmarker.createFromOptions({ wasmLoaderPath: visionWasmLoaderUrl, wasmBinaryPath: visionWasmBinaryUrl }, {
        baseOptions: { modelAssetPath: `${import.meta.env.BASE_URL}models/hand_landmarker.task`, delegate: 'CPU' },
        runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6, minTrackingConfidence: 0.6,
      });
      if (session !== sessionRef.current) { model.close(); return; }
      modelRef.current = model;
      if (newGame || phaseRef.current === 'intro' || phaseRef.current === 'complete') {
        roundsRef.current = createHandPickupRounds(Math.random, Number(itemCount));
        completedRef.current = 0;
        setRounds(roundsRef.current);
        setCompleted(0);
      } else {
        setCompleted(completedRef.current);
      }
      phaseRef.current = 'playing';
      setPhase('playing');
      setCameraState('ready');
      lastActionRef.current = performance.now();
      triggerSpeech('Đưa bàn tay mở đến món rác, nắm lại để nhặt rồi mở tay trên thùng nhé!', 'hand_pickup_intro');
      const cameraEnded = () => {
        if (session !== sessionRef.current) return;
        stopCamera();
        setCameraState('error');
        setError('Camera đã ngắt kết nối. Hãy kết nối lại rồi bật camera để tiếp tục.');
      };
      stream.getVideoTracks().forEach(track => track.addEventListener('ended', cameraEnded, { once: true }));
      let lastInference = -Infinity;
      let lastVideoTime = -1;
      let lastSeen = performance.now();
      const processFrame = (now: number) => {
        if (session !== sessionRef.current) return;
        if (now - lastInference >= 66 && phaseRef.current === 'playing' && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
          lastInference = now;
          lastVideoTime = video.currentTime;
          try {
            const landmarks = modelRef.current!.detectForVideo(video, now).landmarks[0];
            const openness = landmarks ? getHandOpenness(landmarks, video.videoWidth / video.videoHeight) : null;
            if (openness === null) {
              if (now - lastSeen > 450) resetTracking();
            } else {
              lastSeen = now;
              const palm = [0, 5, 9, 13, 17].reduce((sum, index) => ({ x: sum.x + landmarks[index].x / 5, y: sum.y + landmarks[index].y / 5 }), { x: 0, y: 0 });
              const point = mapHandPoint(palm, pointRef.current);
              pointRef.current = point;
              setPointer(point);
              const nextGesture = detectorRef.current.update(openness, now);
              setGesture(nextGesture);
              if (nextGesture === 'open') resumeOpenRef.current = true;
              if (nextGesture && resumeOpenRef.current) {
                const previous = pickupRef.current;
                const round = roundsRef.current[completedRef.current];
                const next = stepHandPickup(previous, point, nextGesture, round.category, round.origin);
                pickupRef.current = next;
                setHolding(next.holding);
                if (next.holding && !previous.holding) {
                  lastActionRef.current = now;
                  setMessage('Đã nhặt được! Đưa tay tới thùng nào.');
                  if (soundRef.current) playPickSfx();
                }
                if (next.result) finishDrop(next.result, point);
              }
            }
            if (phaseRef.current === 'playing' && now - lastActionRef.current > 14000) {
              const category = roundsRef.current[completedRef.current].category;
              if (!pickupRef.current.holding) triggerSpeech('Đưa bàn tay mở tới món rác rồi nắm lại nhé!', 'hand_pickup_hint');
              else if (category === 'organic') triggerSpeech('Mở tay ở thùng Hữu cơ nhé!', 'hand_pickup_drop_organic');
              else triggerSpeech('Mở tay ở thùng Vô cơ nhé!', 'hand_pickup_drop_inorganic');
              lastActionRef.current = now;
            }
          } catch {
            stopCamera();
            setCameraState('error');
            setError('Nhận diện tay bị gián đoạn. Hãy bật lại camera để tiếp tục.');
            return;
          }
        }
        animationRef.current = requestAnimationFrame(processFrame);
      };
      animationRef.current = requestAnimationFrame(processFrame);
    } catch (failure) {
      if (session !== sessionRef.current) { model?.close(); stream?.getTracks().forEach(track => track.stop()); return; }
      stopCamera();
      setCameraState('error');
      setError(cameraError(failure));
    }
  }

  const activeBin = holding && pointer ? getHandDropCategory(pointer) : null;
  const nearby = pointer && currentItem && canPickUp(pointer, currentItem.origin) && !holding;
  const itemPosition = feedback === 'correct' && pointer ? pointer : holding && pointer ? pointer : currentItem?.origin ?? PICKUP_ORIGIN;
  const loading = cameraState === 'loading';
  const playing = phase === 'playing' || phase === 'feedback';

  return (
    <section className="hand-game" aria-label="Tự tay nhặt rác">
      <header className="hand-hud" inert={confirmExit}>
        <button className="hand-icon" title="Thoát trò chơi" aria-label="Thoát trò chơi" onClick={() => {
          if (playing) { stopCamera(); setCompleted(completedRef.current); setConfirmExit(true); }
          else { stopCamera(); onExit(); }
        }}><ArrowLeft /></button>
        <h1>Tự tay nhặt rác</h1>
        <div className="hand-stars" aria-label={`Đã hoàn thành ${completed} trên ${totalItems} món`}>
          {totalItems <= 10 ? Array.from({ length: totalItems }, (_, index) => <Star key={index} size={22} className={index < completed ? 'earned' : ''} />)
            : <progress className="hand-progress" value={completed} max={totalItems} aria-label="Tiến độ dọn rác" />}
        </div>
        <span className="hand-score"><Leaf size={18} /> {completed}/{totalItems}</span>
        <button className="hand-icon" title={sound ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-label={sound ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-pressed={sound} onClick={() => {
          soundRef.current = !sound;
          setSound(!sound);
          if (sound) stopKienSangSpeech();
        }}>{sound ? <Volume2 /> : <VolumeX />}</button>
      </header>

      <div className="hand-stage" inert={confirmExit}>
        <div className={`hand-preview ${!preview ? 'preview-hidden' : ''}`} data-tracking={pointer ? 'found' : 'searching'}>
          <video ref={videoRef} muted playsInline autoPlay aria-label="Camera lật gương" />
          <span>{cameraState === 'ready' ? pointer ? 'Đã thấy tay' : 'Đang tìm bàn tay' : loading ? 'Đang mở camera' : 'Camera đã tắt'}</span>
        </div>
        {playing && <div className="hand-camera-controls">
          <button className="hand-icon" title={preview ? 'Ẩn camera' : 'Hiện camera'} aria-label={preview ? 'Ẩn camera' : 'Hiện camera'} aria-pressed={preview} onClick={() => setPreview(!preview)}>{preview ? <Eye /> : <EyeOff />}</button>
          <button className="hand-icon" disabled={loading} title={cameraState === 'ready' ? 'Dừng camera' : 'Bật lại camera'} aria-label={cameraState === 'ready' ? 'Dừng camera' : 'Bật lại camera'} onClick={() => cameraState === 'ready' ? stopCamera() : void startCamera()}>{cameraState === 'ready' ? <CameraOff /> : <Camera />}</button>
        </div>}

        {playing && currentItem && <>
          <div className="hand-status" role="status" aria-live="polite">{cameraState !== 'ready' ? 'Ván chơi đang tạm dừng' : !pointer ? 'Đưa bàn tay mở vào trước camera' : message}</div>
          <div key={currentItem.id} className={`hand-item ${nearby ? 'nearby' : ''} ${holding ? 'held' : ''} ${feedback === 'correct' ? 'sorted' : ''} ${feedback === 'wrong' || feedback === 'miss' ? 'retry' : ''}`}
            style={{ left: `${itemPosition.x * 100}%`, top: `${itemPosition.y * 100}%` }}>
            <GameImage key={currentItem.image} src={currentItem.image} alt="Món rác cần phân loại" fallback={<Trash2 size={58} />} />
          </div>
          {pointer && cameraState === 'ready' && <div className={`hand-cursor ${gesture === 'closed' ? 'closed' : ''}`} style={{ left: `${pointer.x * 100}%`, top: `${pointer.y * 100}%` }} aria-label={holding ? 'Đang giữ rác' : gesture === 'closed' ? 'Tay nắm' : 'Tay mở'}>
            <HandIllustration closed={gesture === 'closed'} />
            {holding && <Check className="hand-held-check" size={18} />}
          </div>}
        </>}

        <div className="hand-ground" />
        {(['organic', 'recyclable'] as const).map(category => {
          const zone = HAND_DROP_ZONES[category];
          return <div key={category} className={`hand-bin ${category} ${activeBin === category ? 'bin-active' : ''}`} style={{ left: `${zone.x * 100}%`, top: `${zone.y * 100}%`, width: `${zone.width * 100}%`, height: `${zone.height * 100}%` }}>
            <span className="hand-bin-rim" />
            <GameImage src={`${import.meta.env.BASE_URL}images/camera/thung_rac_${category === 'organic' ? 'huu_co' : 'vo_co'}.png`} alt={`Thùng ${LABELS[category]}`} fallback={<Trash2 size={90} />} />
          </div>;
        })}
        <canvas ref={canvasRef} className="hand-confetti" />

        {phase === 'intro' && <div className="hand-welcome">
          <GameImage src={customMascotUrl || `${import.meta.env.BASE_URL}images/kien-sang-main.png`} alt="Robot Kiến Sáng" fallback={<Hand size={80} />} className="hand-mascot" />
          <h2>Cùng Kiến Sáng dọn rác nào!</h2>
          <div className="hand-gesture-demo" aria-label="Mở tay, nắm để nhặt, mở để thả"><HandIllustration /><span>→</span><HandIllustration closed /><span>→</span><HandIllustration /></div>
          <label className="hand-count" htmlFor="hand-item-count">Số món rác
            <input id="hand-item-count" type="number" inputMode="numeric" min={2} max={HAND_PICKUP_MAX_COUNT} step={1} value={itemCount} disabled={loading}
              aria-invalid={!validItemCount} aria-describedby={!validItemCount ? 'hand-count-error' : undefined} onChange={event => setItemCount(event.target.value)} />
          </label>
          {!validItemCount && <span id="hand-count-error" className="hand-count-error" role="alert">Nhập số nguyên từ 2 đến {HAND_PICKUP_MAX_COUNT}.</span>}
          <button className="hand-primary" disabled={loading || !validItemCount} onClick={() => void startCamera(true)}>{loading ? <LoaderCircle className="hand-loading" /> : <Camera />}{loading ? 'Đang chuẩn bị…' : 'Bật camera & Bắt đầu'}</button>
          <p>Hình ảnh chỉ được xử lý trên thiết bị, không lưu hoặc gửi lên máy chủ.</p>
        </div>}

        {playing && cameraState !== 'ready' && !confirmExit && <div className="hand-pause" role="status">
          {loading ? <LoaderCircle className="hand-loading" size={32} /> : <CameraOff size={32} />}
          <h2>{loading ? 'Đang chuẩn bị camera…' : 'Nghỉ một chút nhé!'}</h2>
          {!loading && <button className="hand-primary" onClick={() => void startCamera()}><Camera /> Bật camera để tiếp tục</button>}
        </div>}
        {error && <div className="hand-error" role="alert">{error}</div>}

        {phase === 'complete' && <div className="hand-welcome hand-complete">
          <GameImage src={customMascotUrl || `${import.meta.env.BASE_URL}images/kien-sang-main.png`} alt="Robot Kiến Sáng" fallback={<Star size={80} />} className="hand-mascot" />
          <h2>Sạch rồi! Giỏi lắm!</h2>
          <div className="hand-final-score"><Star /> {completed} / {totalItems} <Star /></div>
          <button className="hand-primary" disabled={loading} onClick={() => void startCamera(true)}>{loading ? <LoaderCircle className="hand-loading" /> : <RotateCcw />} {loading ? 'Đang chuẩn bị…' : 'Chơi lại'}</button>
          <button className="hand-secondary" onClick={onExit}><ArrowLeft /> Về lớp học</button>
        </div>}
      </div>

      {confirmExit && <div className="hand-modal-backdrop"><div className="hand-exit-dialog" role="dialog" aria-modal="true" aria-labelledby="hand-exit-title">
        <h2 id="hand-exit-title">Con muốn về lớp học?</h2>
        <button autoFocus className="hand-primary" onClick={() => { stopCamera(); onExit(); }}><ArrowLeft /> Về lớp học</button>
        <button className="hand-secondary" onClick={() => { setConfirmExit(false); void startCamera(); }}><X /> Chơi tiếp</button>
      </div></div>}
    </section>
  );
}