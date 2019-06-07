import { Interval } from '../interval/factories';

export const add = (i1: IvlName, i2: IvlName, op = true): any => {
  const ivl1 = Interval.fromName(i1);
  const ivl2 = Interval.fromName(i2);
  const semitones = ivl1.semitones + (op ? ivl2.semitones : -1 * ivl2.semitones);

  return Interval.fromSemitones(semitones).name;
};

/**
 * Add two intervals
 *
 * Can be partially applied.
 *
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from "tonal-distance"
 * add("3m", "5P") // => "7m"
 */
export const addIntervals = (...args) => {
  if (args.length === 1) return i2 => add(args[0], i2);
  return add(args[0], args[1], true);
};

/**
 * Subtract two intervals
 *
 * Can be partially applied
 *
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */
export const subIntervals = (...args) => {
  if (args.length === 1) return i2 => add(args[0], i2);
  return add(args[0], args[1], false);
};
