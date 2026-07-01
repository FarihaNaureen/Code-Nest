// src/audio.js
// A simple procedural audio engine for retro sound effects using Web Audio API

let audioCtx = null;

// Initialize the audio context. Should be called after a user interaction to avoid autoplay blocking.
export function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Plays a short, percussive sine wave to simulate retro RPG text typing voices.
// pitch is in Hz (e.g. 400 for low, 800 for high).
export function playDialogueBlip(pitch = 600) {
  if (!audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // Use a slight triangle shape for a more "gamey" voice tone, sine is a bit too clean
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  // Slight drop in pitch for texture
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.8, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  // Quick decay
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}
