/**
 * Sound synthesis and voice playback engine
 * Supports Web Audio SFX + Web Speech API (vi-VN) + Child's Custom Recorded Audio Blobs
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound Effects
export const playPickSfx = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // ignore audio failure
  }
};

export const playDropSfx = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // ignore
  }
};

export const playCountdownSfx = (volume = 0.06) => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    // Audio may be unavailable; answering must remain possible.
  }
};

export const playSuccessSfx = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.28, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  } catch {
    // ignore
  }
};

export const playErrorSfx = () => {
  try {
    const ctx = getAudioContext();
    // Bouncy spring boing effect
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const startTime = ctx.currentTime;
    osc.frequency.setValueAtTime(260, startTime);
    osc.frequency.exponentialRampToValueAtTime(140, startTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(320, startTime + 0.22);
    osc.frequency.exponentialRampToValueAtTime(160, startTime + 0.35);

    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.36);
  } catch {
    // ignore
  }
};

export const playVictoryFanfare = () => {
  try {
    const ctx = getAudioContext();
    const melody = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.4 },  // E5
      { f: 783.99, d: 0.2 },  // G5
      { f: 1046.5, d: 0.7 },  // C6
    ];
    let cursor = ctx.currentTime;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, cursor);
      gain.gain.setValueAtTime(0.3, cursor);
      gain.gain.exponentialRampToValueAtTime(0.005, cursor + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(cursor);
      osc.stop(cursor + note.d);
      cursor += note.d * 0.85;
    });
  } catch {
    // ignore
  }
};

let currentAudio: HTMLAudioElement | null = null;

/**
 * Play a voice message:
 * 1. If child recorded custom audio for this action, play child's voice!
 * 2. Otherwise speak using Web Speech API (vi-VN)
 */
export const speakKienSang = (
  textVi: string,
  customAudioUrl?: string | null,
  onEnded?: () => void
) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();
  // If custom audio provided
  if (customAudioUrl) {
    try {
      const audio = new Audio(customAudioUrl);
      currentAudio = audio;
      audio.onended = () => {
        onEnded?.();
      };
      audio.play().catch((err) => {
        if (currentAudio !== audio || err?.name === 'AbortError') return;
        console.warn('Không phát được giọng thu âm, chuyển sang đọc văn bản:', err);
        // Fallback to speech synthesis if play is blocked
        speakFallbackTTS(textVi, onEnded);
      });
      return;
    } catch {
      // fallback
    }
  }

  speakFallbackTTS(textVi, onEnded);
};

function speakFallbackTTS(textVi: string, onEnded?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnded?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textVi);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.25; // cute, friendly robot/child pitch

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      onEnded?.();
    };
    utterance.onerror = () => {
      onEnded?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnded?.();
  }
}
