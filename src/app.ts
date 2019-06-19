import { Meter, Measure, Duration, Euclid } from '@packages/parser';
import { Factories } from '@packages/note';

const meter = new Meter(5, 8);
const measure = new Measure(meter, 'e');

// console.log(Duration.doubleName('h'));
console.log(Factories.Note.fromName('Eb0'));
// const parser = new Parser();

// console.log(parser.generate());

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
