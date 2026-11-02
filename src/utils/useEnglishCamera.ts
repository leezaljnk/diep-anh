import { useEffect, useRef, useState } from 'react';
import type { NormalizedLandmark, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import visionWasmBinaryUrl from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url';
import visionWasmLoaderUrl from '@mediapipe/tasks-vision/vision_wasm_internal.js?url';

export type EnglishCameraMode = 'hand' | 'pose';
export type EnglishCameraStatus = 'off' | 'loading' | 'ready' | 'error';
export interface EnglishCameraFrame { points: NormalizedLandmark[]; timestamp: number; aspectRatio: number }

export function useEnglishCamera(mode: EnglishCameraMode, onFrame: (frame: EnglishCameraFrame) => void) {
  const [status, setStatus] = useState<EnglishCameraStatus>('off');
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameHandler = useRef(onFrame);
  frameHandler.current = onFrame;
  const resources = useRef<{ session: number; stream: MediaStream | null; model: HandLandmarker | PoseLandmarker | null; animation: number | null }>({ session: 0, stream: null, model: null, animation: null });

  function release() {
    const current = resources.current;
    current.session++;
    if (current.animation !== null) cancelAnimationFrame(current.animation);
    current.animation = null;
    current.stream?.getTracks().forEach(track => track.stop());
    current.stream = null;
    current.model?.close();
    current.model = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function stop() { release(); setStatus('off'); }

  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    return () => { document.removeEventListener('visibilitychange', hidden); release(); };
  }, [mode]);

  async function start() {
    release();
    setError('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError('Camera cần HTTPS hoặc localhost và trình duyệt hỗ trợ camera.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    const session = resources.current.session;
    let createdModel: HandLandmarker | PoseLandmarker | null = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } });
      if (session !== resources.current.session) { stream.getTracks().forEach(track => track.stop()); return; }
      resources.current.stream = stream;
      const video = videoRef.current;
      if (!video) throw new Error('Camera preview unavailable');
      video.srcObject = stream;
      await video.play();
      if (session !== resources.current.session) return;
      const vision = await import('@mediapipe/tasks-vision');
      if (session !== resources.current.session) return;
      const files = { wasmLoaderPath: visionWasmLoaderUrl, wasmBinaryPath: visionWasmBinaryUrl };
      createdModel = mode === 'hand'
        ? await vision.HandLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: `${import.meta.env.BASE_URL}models/hand_landmarker.task`, delegate: 'CPU' },
          runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: 0.6, minHandPresenceConfidence: 0.6, minTrackingConfidence: 0.6,
        })
        : await vision.PoseLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: `${import.meta.env.BASE_URL}models/pose_landmarker_lite.task`, delegate: 'CPU' },
          runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: 0.6, minPosePresenceConfidence: 0.6, minTrackingConfidence: 0.6,
        });
      if (session !== resources.current.session) { createdModel.close(); return; }
      resources.current.model = createdModel;
      stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => {
        if (session === resources.current.session) {
          release(); setError('Camera đã ngắt kết nối. Hãy kết nối lại rồi thử lại.'); setStatus('error');
        }
      }, { once: true }));
      if (!stream.active) throw new Error('Camera disconnected');
      setAspectRatio(video.videoWidth / video.videoHeight || 4 / 3);
      setStatus('ready');
      let lastTime = -1;
      let lastInference = -Infinity;
      const model = createdModel;
      const tick = (timestamp: number) => {
        if (session !== resources.current.session) return;
        try {
          if (video.readyState >= 2 && video.currentTime !== lastTime && timestamp - lastInference >= 50) {
            lastTime = video.currentTime;
            lastInference = timestamp;
            const result = mode === 'hand'
              ? (model as HandLandmarker).detectForVideo(video, timestamp)
              : (model as PoseLandmarker).detectForVideo(video, timestamp);
            frameHandler.current({ points: result.landmarks[0] ?? [], timestamp, aspectRatio: video.videoWidth / video.videoHeight });
          }
          resources.current.animation = requestAnimationFrame(tick);
        } catch {
          release(); setError('Bộ nhận diện đã dừng. Hãy bật lại camera để tiếp tục.'); setStatus('error');
        }
      };
      resources.current.animation = requestAnimationFrame(tick);
    } catch (cause) {
      if (session !== resources.current.session) return;
      release();
      const name = cause instanceof Error ? cause.name : '';
      setError(name === 'NotAllowedError' || name === 'SecurityError'
        ? 'Chưa được cấp quyền camera. Hãy cho phép camera trong trình duyệt rồi thử lại.'
        : name === 'NotFoundError' ? 'Không tìm thấy camera. Hãy kết nối camera rồi thử lại.'
          : name === 'NotReadableError' ? 'Camera đang bận. Hãy đóng ứng dụng khác đang dùng camera.'
            : 'Không mở được camera hoặc bộ nhận diện. Hãy kiểm tra kết nối rồi thử lại.');
      setStatus('error');
    }
  }

  return { videoRef, status, error, aspectRatio, start, stop };
}