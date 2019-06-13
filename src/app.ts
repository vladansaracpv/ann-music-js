import { Meter, Measure, Duration } from '@packages/parser';

const meter = new Meter(12, 4);
console.log(meter);
const measure = new Measure(meter, 'e');
console.log(measure);

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
