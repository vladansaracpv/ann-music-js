import { SimplePlayer, SequenceParser } from './packages/player';
import { Parser } from './packages/parser/parser';
import { add, addN } from './base/math';
import { curry, partial } from './base/functional';

const cadd = partial(add, 1);

console.log(cadd(3));

/**
 * Note
 * Interval
 * Chord
 * Scale
 * PC
 * Distance (Transpose)
 *
 * Parser
 * Generative
 * Rhythm
 * Midi
 * Composition
 * Player
 * UI
 */
