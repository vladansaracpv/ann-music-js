import { scales } from './packages/scale';
import { chords } from './packages/chord';
import { noteFromName, noteFromMidi, noteFromFreq } from './packages/note';
import { chromas, modes, intervals, isEqual, isSubsetOf, isSupersetOf, includes, filter } from './packages/pc';

console.log(noteFromFreq(207));

// console.log(filter(['C', 'D', 'E'], ['c2', 'c#2', 'd2', 'c3', 'c#3', 'd3']));

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
