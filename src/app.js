"use strict";
exports.__esModule = true;
// import { Distance } from './note/distance';
// import { Note } from './note/index';
// import * as Tone from 'Tone';
var Tone = require("tone");
// const c = Note.create('C4');
var audioCtx = new AudioContext();
var oscillator = audioCtx.createOscillator();
oscillator.type = 'sine'; // sine wave — other values are 'sine', 'sawtooth', 'triangle' and 'custom'
// oscillator.frequency.value = c.frequency; // value in hertz
var gainNode = audioCtx.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
var now = audioCtx.currentTime;
var kick;
var hat;
var snare;
// const Tone = require('Tone');
var synth = new Tone.FMSynth().toMaster();
synth.triggerAttackRelease('C4', 0.5, 0);
synth.triggerAttackRelease('E4', 0.5, 1);
synth.triggerAttackRelease('G4', 0.5, 2);
synth.triggerAttackRelease('B4', 0.5, 3);
