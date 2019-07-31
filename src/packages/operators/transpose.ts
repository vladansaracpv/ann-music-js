import { Note } from '../note/factories';
import { IvlFactory } from '../interval/factories';
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
 * ["C", "D", "E", "F", "G"].map(transpose("M3")) // => ["E", "F#", "G#", "A", "B"]
 */
export const transpose = (...args: string[]): any => {
  if (args.length === 1) {
    return (i: string) => transpose(i, args[0]);
  }
  const [n, i] = args;
  const note = Note({ name: n });
  const interval = IvlFactory.fromName(i);

  return Note({ midi: note.midi + interval['semitones'] }).name;
};
