export function stopEnglishSpeech(): void {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
}

export function speakEnglish(text: string): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return false;
  stopEnglishSpeech();
  const voice = window.speechSynthesis.getVoices().find(voice => voice.localService && /^en[-_]/i.test(voice.lang));
  if (!voice) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = 0.8;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
  return true;
}