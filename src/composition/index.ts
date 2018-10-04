export namespace Composition {
const audioCtx = new AudioContext();

const oscillator = audioCtx.createOscillator();

const gainNode = audioCtx.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

oscillator.type = 'square'; // sine wave — other values are 'sine', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 180; // value in hertz

const now = audioCtx.currentTime;

oscillator.start(now);
oscillator.stop(now + 1);
}
