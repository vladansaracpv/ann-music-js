import { scales } from './packages/scale';
import { chords } from './packages/chord';
import { noteFromName, noteFromMidi, noteFromFreq } from './packages/note';
import { pcsetNum, filter } from './packages/pc';

// console.log(pcsetNum('101010000000'));

console.log(filter(['C', 'D', 'E'], ['c2', 'c#2', 'd2', 'c3', 'c#3', 'd3']));

/**
 * Note
 * Duration
 * Interval
 * Chord
 * Scale
 * PC
 * Distance (Transpose)
 *
 * Parser
 * Midi
 * Composition
 * Player
 */
