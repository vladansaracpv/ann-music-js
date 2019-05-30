import { scales } from './packages/scale';
import { chords } from './packages/chord';
import { noteFromName, noteFromMidi, noteFromFreq } from './packages/note';
import { pcsetNum, filter } from './packages/pc';
import { Parser, Euclid } from '@packages/parser';

const parser = new Parser();
const pattern = parser.generate();

// console.log(pattern);

console.log(Euclid(3, 7));

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
