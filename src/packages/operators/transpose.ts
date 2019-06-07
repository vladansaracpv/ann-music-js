import { Note } from '../note/factories';
import { Interval } from '../interval/factories';
/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from "tonal-distance"
 * transpose("d3", "3M") // => "F#3"
 * // it works with pitch classes
 * transpose("D", "3M") // => "F#"
 * // can be partially applied
 * ["C", "D", "E", "F", "G"].map(transpose("M3)) // => ["E", "F#", "G#", "A", "B"]
 */
export const transpose = (...args: string[]): any => {
  if (args.length === 1) {
    return (i: string) => transpose(args[0], i);
  }
  const [n, i] = args;
  const note = Note.fromName(n);
  const interval = Interval.fromName(i);

  return Note.fromMidi(note.midi + interval.semitones).name;
};

/**
 * The same as transpose with the arguments inverted.
 *
 * Can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from "tonal-distance"
 * transposeBy("3m", "5P") // => "7m"
 */
export const transposeBy = (...args): any => {
  if (args.length === 1) return n => transpose(n, args[0]);
  return transpose(args[1], args[0]);
};
