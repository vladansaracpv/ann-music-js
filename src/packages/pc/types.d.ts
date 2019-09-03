type PcChroma = string;
type PcNum = number;

/**
 * The properties of a pitch class set
 * @param {number} num - a number between 1 and 4095 (both included) that
 * uniquely identifies the set. It's the decimal number of the chrom.
 * @param {string} chroma - a string representation of the set: a 12-char string
 * with either "1" or "0" as characters, representing a pitch class or not
 * for the given position in the octave. For example, a "1" at index 0 means 'C',
 * a "1" at index 2 means 'D', and so on...
 * @param {number} length - the number of notes of the pitch class set
 * @param {string} normalized - @chroma rotated so that it starts with '1'
 * *starting from C*
 */

interface PcProperties {
  empty: boolean;
  num: number;
  chroma: PcChroma;
  normalized: PcChroma;
  length?: number;
}
type PcProps = Readonly<PcProperties>;

type PcSet = PcProps | PcChroma | PcNum | NoteName[] | IvlName[];
