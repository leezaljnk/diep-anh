import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ShoppingBasket as Basket, Camera, CameraOff, Check, Hand, HandGrab, LoaderCircle, Play, RotateCcw, SkipForward, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ENGLISH_CATCH_ROUNDS } from '../data/englishVocab';
import { ENGLISH_TPR_ACTIONS, TPR_ROUND_COUNT, TPR_ROUND_MS, type TprActionId } from '../data/englishTprActions';
import { CATCH_BASKET, CATCH_ORIGINS, createEnglishCatchRounds, EMPTY_ENGLISH_CATCH, stepEnglishCatch } from '../utils/englishHandCatch';
import { getHandOpenness, HandGestureDetector, mapHandPoint, type HandGesture, type HandPoint } from '../utils/handPickup';
import { matchTprPose, PoseDwellTracker, type PoseMatch } from '../utils/englishTprLogic';
import { shuffleItems } from '../utils/headTiltSorting';
import { speakEnglish, stopEnglishSpeech } from '../utils/speech';
import { stopKienSangSpeech } from '../utils/audio';
import { useEnglishCamera, type EnglishCameraFrame, type EnglishCameraMode } from '../utils/useEnglishCamera';
import './EnglishGame.css';

function PoseDemo({ action, celebrate = false }: { action: TprActionId; celebrate?: boolean }) {
  const arms: Record<TprActionId, string[]> = {
    'hands-up': ['72,95 48,62 40,24', '128,95 152,62 160,24'],
    'touch-head': ['72,95 43,65 77,40', '128,95 146,126 140,157'],
    clap: ['72,95 55,130 96,112', '128,95 145,130 104,112'],
    'open-arms': ['72,95 42,95 13,95', '128,95 158,95 187,95'],
    sleepy: ['72,95 48,65 75,56', '128,95 146,126 140,157'],
    surprised: ['72,95 48,75 75,56', '128,95 152,75 125,56'],
  };
  return <svg className={`english-pose-demo ${celebrate ? 'celebrating' : ''}`} viewBox="0 0 200 220" role="img" aria-label={ENGLISH_TPR_ACTIONS.find(item => item.id === action)?.label}>
    <ellipse cx="100" cy="209" rx="55" ry="6" fill="#b9d9d0" />
    <path d="M85 146V190H67M115 146V190H133" stroke="#267d85" strokeWidth="15" fill="none" strokeLinecap="round" />
    <rect x="70" y="86" width="60" height="68" rx="12" fill="#36b5bb" stroke="#16636f" strokeWidth="3" />
    <path d="M90 116H110M100 106V126" stroke="#fff3a3" strokeWidth="7" strokeLinecap="round" />
    <g className={`demo-arms demo-${action}`} stroke="#16636f" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {arms[action].map((points, index) => <polyline key={index} points={points} />)}
    </g>
    <g transform={action === 'sleepy' ? 'rotate(30 100 66)' : undefined}>
      <path d="M100 26V14" stroke="#16636f" strokeWidth="4" /><circle cx="100" cy="12" r="5" fill="#e56975" />
      <rect x="69" y="29" width="62" height="49" rx="14" fill="#ffe18a" stroke="#16636f" strokeWidth="3" />
      {action === 'sleepy' ? <path d="M80 48H90M110 48H120" stroke="#16636f" strokeWidth="4" strokeLinecap="round" /> : <g fill="#16636f"><circle cx="85" cy="48" r="5" /><circle cx="115" cy="48" r="5" /></g>}
      {action === 'surprised' ? <ellipse cx="100" cy="64" rx="6" ry="8" fill="#16636f" /> : <path d="M90 61Q100 72 110 61" stroke="#16636f" strokeWidth="3" fill="none" strokeLinecap="round" />}
    </g>
  </svg>;
}

function EnglishCameraGame({ mode, onExit }: { mode: EnglishCameraMode; onExit: () => void }) {
  const [catchRounds] = useState(createEnglishCatchRounds);
  const [tprRounds] = useState(() => shuffleItems(ENGLISH_TPR_ACTIONS).slice(0, TPR_ROUND_COUNT));
  const total = mode === 'hand' ? ENGLISH_CATCH_ROUNDS : TPR_ROUND_COUNT;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'complete'>('playing');
  const [stars, setStars] = useState<boolean[]>([]);
  const [sound, setSound] = useState(true);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const [localVoice, setLocalVoice] = useState(false);
  const [pointer, setPointer] = useState<HandPoint | null>(null);
  const [gesture, setGesture] = useState<HandGesture | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  const [retry, setRetry] = useState(false);
  const [poseMatch, setPoseMatch] = useState<PoseMatch>('out-of-frame');
  const [dwell, setDwell] = useState(0);
  const [remaining, setRemaining] = useState(TPR_ROUND_MS / 1000);
  const [demo, setDemo] = useState(false);
  const detector = useRef(new HandGestureDetector());
  const dwellTracker = useRef(new PoseDwellTracker());
  const catchState = useRef({ ...EMPTY_ENGLISH_CATCH });
  const previousPoint = useRef<HandPoint | null>(null);
  const lastHandFrame = useRef<number | null>(null);
  const locked = useRef(false);
  const celebrationCanvas = useRef<HTMLCanvasElement>(null);
  const celebration = useRef<ReturnType<typeof confetti.create> | null>(null);
  const catchRound = catchRounds[index];
  const tprRound = tprRounds[index];
  const prompt = mode === 'hand' ? catchRound?.target.word : tprRound?.prompt;

  function resetTracking() {
    detector.current.reset(); dwellTracker.current.reset();
    catchState.current = { ...EMPTY_ENGLISH_CATCH }; previousPoint.current = null;
    lastHandFrame.current = null;
    setPointer(null); setGesture(null); setHeld(null); setDwell(0); setPoseMatch('out-of-frame');
  }

  function finish() {
    if (locked.current) return;
    locked.current = true;
    setStars(previous => [...previous, true]);
    setPhase('feedback');
    if (sound) speakEnglish('Super! You did it!');
    if (celebrationCanvas.current) {
      celebration.current ??= confetti.create(celebrationCanvas.current, { resize: true });
      void celebration.current({ particleCount: 55, spread: 75, origin: { x: 0.5, y: 0.6 }, disableForReducedMotion: true });
    }
  }

  function onFrame({ points, timestamp, aspectRatio }: EnglishCameraFrame) {
    if (locked.current || phase !== 'playing') return;
    if (mode === 'pose') {
      const match = matchTprPose(tprRound.id, points, aspectRatio);
      const progress = dwellTracker.current.update(match === 'matched', timestamp);
      setPoseMatch(match); setDwell(progress);
      if (progress === 1) finish();
      return;
    }
    if (lastHandFrame.current !== null && timestamp - lastHandFrame.current > 250) resetTracking();
    lastHandFrame.current = timestamp;
    const openness = getHandOpenness(points, aspectRatio);
    if (openness === null) { resetTracking(); return; }
    const point = mapHandPoint(points[9], previousPoint.current);
    previousPoint.current = point;
    setPointer(point);
    const nextGesture = detector.current.update(openness, timestamp);
    setGesture(nextGesture);
    if (!nextGesture) return;
    const next = stepEnglishCatch(catchState.current, point, nextGesture, catchRound, aspectRatio);
    catchState.current = next.state;
    setHeld(next.state.held);
    if (next.result === 'correct') finish();
    if (next.result === 'retry') { setRetry(true); if (sound) speakEnglish('Try again!'); }
    else if (next.state.held !== null) setRetry(false);
  }

  const camera = useEnglishCamera(mode, onFrame);

  function advance() {
    resetTracking(); setDemo(false); setRetry(false);
    if (index + 1 >= total) {
      locked.current = true; camera.stop(); celebration.current?.reset(); setPhase('complete');
    } else {
      locked.current = false; setIndex(index + 1); setPhase('playing');
    }
  }

  useEffect(() => {
    stopKienSangSpeech();
    const updateVoices = () => setLocalVoice(Boolean(window.speechSynthesis?.getVoices().some(voice => voice.localService && /^en[-_]/i.test(voice.lang))));
    updateVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', updateVoices);
      stopEnglishSpeech(); celebration.current?.reset();
    };
  }, []);

  useEffect(() => {
    if (camera.status === 'ready' && phase === 'playing' && sound && prompt) speakEnglish(prompt);
    if (!sound || camera.status !== 'ready') stopEnglishSpeech();
  }, [camera.status, index, phase, sound, localVoice]);

  useEffect(() => {
    if (camera.status !== 'ready') resetTracking();
  }, [camera.status]);

  useEffect(() => {
    if (phase !== 'feedback') return;
    const timer = window.setTimeout(advance, 1400);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (mode !== 'pose' || camera.status !== 'ready' || phase !== 'playing' || demo) return;
    const deadline = performance.now() + TPR_ROUND_MS;
    setRemaining(TPR_ROUND_MS / 1000);
    const timer = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) { setDemo(true); if (soundRef.current) speakEnglish("Let's try together!"); }
    }, 100);
    return () => window.clearInterval(timer);
  }, [mode, camera.status, phase, index, demo]);

  const score = stars.filter(Boolean).length;
  const ready = camera.status === 'ready';
  return <section className="english-game" aria-label={mode === 'hand' ? 'Bàn Tay Bắt Chữ' : 'Bé Cùng Vận Động'}>
    <header className="english-toolbar">
      <button className="english-icon" onClick={onExit} title="Về chọn chế độ" aria-label="Về chọn chế độ"><ArrowLeft /></button>
      <strong>{mode === 'hand' ? 'Bàn Tay Bắt Chữ' : 'Bé Cùng Vận Động'}</strong>
      <span className="english-score"><Star /> {score}/{total}</span>
      <button className="english-icon" onClick={() => setSound(!sound)} title={sound ? 'Tắt tiếng' : 'Bật tiếng'} aria-label={sound ? 'Tắt tiếng' : 'Bật tiếng'} aria-pressed={!sound}>{sound ? <Volume2 /> : <VolumeX />}</button>
      {phase !== 'complete' && <button className="english-icon" onClick={() => ready || camera.status === 'loading' ? camera.stop() : void camera.start()} title={ready || camera.status === 'loading' ? 'Tắt camera' : 'Bật camera'} aria-label={ready || camera.status === 'loading' ? 'Tắt camera' : 'Bật camera'}>{ready ? <CameraOff /> : <Camera />}</button>}
    </header>
    {phase === 'complete' ? <div className="english-complete">
      <PoseDemo action="hands-up" celebrate />
      <h1>Giỏi lắm, bé ơi!</h1><p>Hoàn thành {total} lượt · {score} ngôi sao</p>
      <button className="english-primary" onClick={onExit}><RotateCcw /> Chơi tiếp</button>
    </div> : <>
      <div className="english-prompt">
        <span>Lượt {index + 1}/{total}</span>
        <h1>{prompt}</h1>
        <button className="english-icon" disabled={!sound || !localVoice} onClick={() => prompt && speakEnglish(prompt)} title="Nghe lại" aria-label="Nghe lại"><Volume2 /></button>
      </div>
      <div className="english-play-layout">
        <div className={`english-camera-stage ${mode === 'pose' ? `match-${poseMatch}` : ''} ${phase === 'feedback' ? 'english-success' : ''}`} style={{ aspectRatio: camera.aspectRatio }}>
          <video ref={camera.videoRef} autoPlay muted playsInline className={ready ? '' : 'english-video-hidden'} />
          {mode === 'hand' && ready && <>
            {catchRound.choices.map((choice, choiceIndex) => {
              const position = held === choiceIndex && pointer ? pointer : CATCH_ORIGINS[choiceIndex];
              return <div key={choice.id} className={`english-bubble bubble-${choiceIndex} ${held === choiceIndex ? 'is-held' : ''}`} style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}>
                <img src={`${import.meta.env.BASE_URL}${choice.image}`} alt={choice.meaningVi} draggable={false} />
              </div>;
            })}
            <div className="english-basket" style={{ left: `${CATCH_BASKET.x * 100}%`, top: `${CATCH_BASKET.y * 100}%`, width: `${CATCH_BASKET.width * 100}%`, height: `${CATCH_BASKET.height * 100}%` }}><Basket aria-label="Giỏ thu thập" /></div>
            {pointer && <div className={`english-hand ${gesture === 'closed' ? 'is-closed' : ''}`} style={{ left: `${pointer.x * 100}%`, top: `${pointer.y * 100}%` }}>{gesture === 'closed' ? <HandGrab /> : <Hand />}</div>}
          </>}
          {mode === 'pose' && ready && <div className="english-dwell" role="progressbar" aria-label="Giữ tư thế" aria-valuenow={Math.round(dwell * 100)} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${dwell * 100}%` }} /></div>}
          {phase === 'feedback' && <div className="english-feedback" role="status"><Check /> Super!</div>}
          {!ready && <div className="english-camera-cover">
            {camera.status === 'loading' ? <LoaderCircle className="english-spinner" /> : <Camera />}
            <h2>{camera.status === 'loading' ? 'Đang mở camera…' : 'Sẵn sàng cùng bé'}</h2>
            {camera.error && <p role="alert">{camera.error}</p>}
            <button className="english-primary" disabled={camera.status === 'loading'} onClick={() => void camera.start()}><Play /> {camera.status === 'error' ? 'Thử lại' : 'Bắt đầu'}</button>
          </div>}
          <canvas className="english-confetti" ref={celebrationCanvas} aria-hidden="true" />
        </div>
        <aside className={`english-side ${demo ? 'english-demonstrating' : ''}`}>
          {mode === 'pose' ? <>
            <div className="english-action-heading"><span>{demo ? 'Cùng làm với Kiến Sáng' : tprRound.label}</span><strong aria-label="Giây còn lại">{demo ? <Sparkles /> : `${remaining}s`}</strong></div>
            <PoseDemo action={tprRound.id} celebrate={phase === 'feedback'} />
            <div className="english-stars" aria-label={`${score} sao đã nhận`}>{Array.from({ length: total }, (_, starIndex) => <Star key={starIndex} className={stars[starIndex] ? 'earned' : ''} />)}</div>
            {demo && <button className="english-secondary" onClick={() => { setStars(previous => [...previous, false]); advance(); }}><SkipForward /> Động tác tiếp theo</button>}
          </> : <>
            <img className="english-target" src={`${import.meta.env.BASE_URL}${catchRound.target.image}`} alt={catchRound.target.meaningVi} />
            <h2>{catchRound.target.meaningVi}</h2>
            <div className="english-catch-sequence" aria-hidden="true"><Hand /><span>→</span><HandGrab /><span>→</span><Basket /></div>
            <progress value={stars.length} max={total} aria-label="Tiến trình bắt từ" />
          </>}
          <p className="english-status" role="status">{!ready ? 'Camera đang tắt' : phase === 'feedback' ? 'Bé làm được rồi!' : mode === 'hand' ? retry ? 'Thử lại nhé!' : !pointer ? 'Đưa bàn tay vào khung hình' : held !== null ? 'Mang bóng về giỏ' : 'Mở tay, rồi nắm lấy bóng' : poseMatch === 'out-of-frame' ? 'Lùi lại để thấy đầu, vai và hai tay' : poseMatch === 'matched' ? 'Đúng rồi, giữ một chút nhé!' : demo ? 'Cùng làm theo Kiến Sáng nhé!' : 'Kiến Sáng đang chờ bé'}</p>
        </aside>
      </div>
    </>}
    {sound && !localVoice && <p className="english-voice-warning" role="status">Chưa có giọng tiếng Anh cục bộ. Cần cài giọng tiếng Anh trên thiết bị để nghe từ.</p>}
  </section>;
}

export function EnglishGameHub({ onExit, customMascotUrl }: { onExit: () => void; customMascotUrl: string | null }) {
  const [mode, setMode] = useState<EnglishCameraMode | null>(null);
  useEffect(() => { stopKienSangSpeech(); }, []);
  if (mode) return <EnglishCameraGame key={mode} mode={mode} onExit={() => setMode(null)} />;
  return <section className="english-hub">
    <header className="english-toolbar"><button className="english-icon" onClick={onExit} title="Về lớp học" aria-label="Về lớp học"><ArrowLeft /></button><strong>Kiến Sáng English</strong></header>
    <main className="english-hub-content">
      <img className="english-mascot" src={customMascotUrl || `${import.meta.env.BASE_URL}images/kien-sang-main.png`} alt="Kiến Sáng" />
      <h1>Vui Học Tiếng Anh<br />Cùng Kiến Sáng</h1>
      <div className="english-mode-list">
        <button className="english-mode english-mode-catch" onClick={() => setMode('hand')}>
          <div className="english-mode-art"><img src={`${import.meta.env.BASE_URL}english/images/illustrated/apple.png`} alt="Quả táo" /><HandGrab /></div>
          <span>Bàn Tay Bắt Chữ</span><small>15 lượt</small><Play />
        </button>
        <button className="english-mode english-mode-tpr" onClick={() => setMode('pose')}>
          <PoseDemo action="hands-up" /><span>Bé Cùng Vận Động</span><small>5 lượt</small><Play />
        </button>
      </div>
    </main>
  </section>;
}