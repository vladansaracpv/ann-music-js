// import { Distance } from './note/distance';
// import { Note } from './note/index';
// import * as Tone from 'Tone';
import * as Tone from 'tone';

// const c = Note.create('C4');

const audioCtx = new AudioContext();

const oscillator = audioCtx.createOscillator();
oscillator.type = 'sine'; // sine wave — other values are 'sine', 'sawtooth', 'triangle' and 'custom'
// oscillator.frequency.value = c.frequency; // value in hertz

const gainNode = audioCtx.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

const now = audioCtx.currentTime;

let kick;
let hat;
let snare;

// const Tone = require('Tone');

const synth = new Tone.FMSynth().toMaster();

synth.triggerAttackRelease('C4', 0.5, 0);
synth.triggerAttackRelease('E4', 0.5, 1);
synth.triggerAttackRelease('G4', 0.5, 2);
synth.triggerAttackRelease('B4', 0.5, 3);
