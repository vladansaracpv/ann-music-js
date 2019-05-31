import { dictionary } from '@base/dictionary';
import cdata from './chords.json';

/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * @function
 * @param {string} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */
export const chord = dictionary(cdata);
