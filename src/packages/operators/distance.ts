import { Factory } from '../note/factories';
/**
 * Get the distance between two notes in semitones
 *
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from "tonal-distance"
 * semitones("C3", "A2") // => -3
 * // or use tonal
 * Tonal.Distance.semitones("C3", "G3") // => 7
 */
export const semitones = (...args) => {
  if (args.length === 1) return t => semitones(args[0], t);
  const f = Factory.fromName(args[0]);
  const t = Factory.fromName(args[1]);
  return f.midi !== null && t.midi !== null
    ? t.midi - f.midi
    : f.chroma !== null && t.chroma !== null
    ? (t.chroma - f.chroma + 12) % 12
    : null;
};
