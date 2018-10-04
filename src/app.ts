import { Distance } from './note/distance';
// import * as operators from './note/operators';
// import * as note from './note/properties';
// import * as transpose from './note/transpose';
// import { Validator } from './note/validator';
// import * as helpers from './helpers';
// import * as factory from './note/factory';
// import { Note } from './note/index';
// import { Theory } from './interval/theory';
// import { Properties } from './interval/properties';

// import * as beat from './beat';

// import * as comp from './composition/index';

// comp;

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

console.log(Distance.distance('C4', 'C6'));
