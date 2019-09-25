import { both, either } from '@packages/base/boolean';
import { CustomError } from '@packages/base/error';
import { curry } from '@packages/base/functional';
import { inSegment } from '@packages/base/relations';
import { isArray, isNumber } from '@packages/base/typings';
import { Interval, INTERVAL, IvlProps } from '@packages/interval';
import { Note, NOTE } from '@packages/note';

import { compact, range, rotate, toBinary } from '../base/arrays';
import * as Theory from './theory';

export * from './theory';

const PcError = CustomError('PC');

const ITheory = INTERVAL && INTERVAL.Theory;
const IVLS = ITheory && ITheory.INTERVAL_NAMES;

const cache: { [key in string]: PcProps } = {};

export const PcValidator = {
  isPcsetNum: (set: any): set is PcNum => isNumber(set) && inSegment(0, 4095, set),
  isChroma: (set: any): set is PcChroma => Theory.PC_SET_REGEX.test(set),
  isPcset: (set: any): set is PcProps => set && this.isChroma(set.chroma),
};

/**
 * Rotates chroma string so that it starts with 1
 * @param {PcChroma} chroma
 * @returns {PcChroma}
 */
function normalize(chroma: PcChroma): PcChroma {
  const first = chroma.indexOf('1');
  return chroma.slice(first, 12) + chroma.slice(0, first);
}

/**
 * Calculate PcChroma set from given PcChroma string
 * @param {PcChroma} chroma
 * @returns {PcProps}
 */
function properties(chroma: PcChroma): PcProps {
  const num = parseInt(chroma, 2);
  const normalized = normalize(chroma);

  let length = 0;

  for (let i = 0; i < 12; i++) {
    if (chroma.charAt(i) === '1') length++;
  }

  const empty = length == 0;

  return { empty, num, chroma, normalized, length };
}

/**
 * Converts Note/Inverval array to PcChroma string
 * @param {Array<NoteName>|Array<IvlName>} set
 * @returns {PcChroma}
 */
export function toChroma(set: NoteName[] | IvlName[]): PcChroma {
  if (set.length === 0) {
    return Theory.EmptySet.chroma;
  }

  const isNote = NOTE.Validators.isName;
  const isIvl = (name: string) => INTERVAL.Theory.INTERVAL_REGEX.test(name);

  let pitch: NoNote | NoteProps | IvlProps | null;

  const binary = Array(12).fill(0);

  for (let i = 0; i < set.length; i++) {
    // Is it Note?
    if (isNote(set[i])) {
      pitch = Note && (Note(set[i]) as NoteProps);
    }

    // Is it Interval?
    if (isIvl(set[i])) {
      pitch = Interval({ name: set[i] }) as IvlProps;
    }

    // Is it neither Note or Interval?
    if (!pitch) {
      return Theory.EmptySet.chroma;
    }

    // Is it Note or Interval?
    if (pitch.valid) {
      binary[pitch.chroma] = 1;
    }
  }
  return binary.join('');
}

/**
 * Calculate PcProps from given PcSet
 * @param {PcSet} src
 * @returns {PcProps}
 */
export function pcset(src: PcSet): PcProps {
  const chroma: PcChroma = PcValidator.isChroma(src)
    ? src
    : PcValidator.isPcsetNum(src)
    ? Number(src)
        .toString(2)
        .padStart(12, '0')
    : isArray(src)
    ? toChroma(src)
    : PcValidator.isPcset(src)
    ? src.chroma
    : Theory.EmptySet.chroma;

  return (cache[chroma] = cache[chroma] || properties(chroma));
}

/**
 * Get PcProps value for given key
 * @param {string} key. keyof PcProps => {num, chroma, normalized, length}
 * @returns {string|number}
 */
export function pcsetProp(key: keyof PcProps) {
  return (src: PcSet) => {
    const s = pcset(src);
    return s ? s[key] : null;
  };
}

/**
 * Get a list of all possible pitch class sets (all possible chromas) *having C as root*.
 * There are 2048 different chromas.
 * If len is provided it filters to those PcChromas of length == len
 *
 * @see http://allthescales.org/
 * @param {number} len
 * @returns {Array<PcChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */
export function chromaList(len?: number): PcChroma[] {
  let all: PcChroma[] = range(2048, 4095).map(toBinary);
  return len == undefined ? all.slice() : all.filter(chroma => pcset(chroma).length === len);
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0" (normalize=true)
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {PcSet} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @returns {Array<string>} an array with all the modes of the chroma
 */
export function modes(set: PcSet, normalize?: boolean): PcChroma[] {
  const pcs = pcset(set);
  const binary = pcs.chroma.split('');

  normalize = normalize !== false;

  return compact(
    binary.map((b, i) => {
      // make rotation starting with i
      const r = rotate(i, binary);
      // if we want normalized array, then we accept only those starting with r[0] === '1'
      return normalize && r[0] === '0' ? null : r.join('');
    }),
  );
}

/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array<PcSet>} one - one of the pitch class sets
 * @param {Array<PcSet>} other - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
export function isEqual(one: PcSet, other: PcSet) {
  const num = pcsetProp('num');
  return num(one) === num(other);
}

/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcSet} set - the superset to test against (chroma or list of notes)
 * @param {PcSet} notes - the subset to test (chroma or list of notes)
 * @return {boolean}
 */
export const isSubsetOf = curry((set: PcSet, notes: PcSet) => {
  const s = pcset(set).num;
  const o = pcset(notes).num;

  return s !== o && (o & s) === o;
});

/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {PcSet} set - the subset to test against (chroma or list of notes)
 * @param {PcSet} notes - the subset to test (chroma or list of notes)
 * @return {boolean}
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
export const isSupersetOf = curry((set: PcSet, notes: PcSet) => {
  const s = pcset(set).num;
  const o = pcset(notes).num;
  return s !== o && (o | s) === o;
});

/**
 * Test if a given pitch class set includes a note
 *
 * @param {PcSet} set - the base set to test against
 * @param {NoteName} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteInSet(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */
export const isNoteInSet = curry(
  (set: PcSet, note: NoteName): boolean => {
    const s = pcset(set);
    const n = Note && Note(note);
    return s && n.valid && s.chroma.charAt(n.chroma) === '1';
  },
);

/**
 * Filter a list with a pitch class set
 *
 * @param {PcSet} set - the pitch class set notes
 * @param {Array<NoteName>} notes - the note list to be filtered
 * @return {Array<NoteName>} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
export const filterNotes = curry((set: PcSet, notes: NoteName[]) => {
  const memberOfSet = isNoteInSet(set);
  return notes.filter(memberOfSet);
});

/**
 * Get the distance between two notes in semitones
 *
 * @param {NoteName} from - first note
 * @param {NoteName} to - last note
 * @return {number} the distance in semitones or null if not valid notes
 */
export const semitones = (...args: NoteName[]) => {
  if (args.length === 1) return (t: NoteName) => semitones(args[0], t);

  const f = Note && Note(args[0] as NoteName);
  const t = Note && Note(args[1] as NoteName);

  return either(t.midi - f.midi, null, both(f.valid, t.valid));
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                 INTERVAL - PC methods                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/**
 * Get the intervals of a pcset *starting from C*
 * @param {PcSet} src - the pitch class set
 * @returns {IntervalName[]} an array of interval names or an empty array if not a valid pitch class set
 */
export function intervals(src: PcSet): IvlName[] {
  const intervals: IvlName[] = [];
  const set = pcset(src);

  // PcChroma to array
  const chroma = set.chroma.split('');
  // Map every c == '1' to Interval at position i, then filter existing values
  return compact(chroma.map((c, i) => (c == '1' ? IVLS[i] : null)));
}

/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {NoteName} note
 * @param {IvlName} interval
 * @return {NoteName} the transposed note
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
    return (i: NoteName) => transpose(i, args[0]);
  }
  const [n, i] = args;
  const note = Note && Note(n);
  const interval = Interval({ name: i });

  if (!both(note.valid, interval.valid)) return undefined;

  const amount: NoteMidi = note.midi + interval.semitones;

  return Note && Note(amount).name;
};
