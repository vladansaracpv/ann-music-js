import { dictionary } from '@base/dictionary';
import sdata from './scales.json';

/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * @function
 * @param {string} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */
export const scale = dictionary(sdata);
