import { BaseArray, BaseBoolean, BaseRelations, BaseTypings } from 'ann-music-base';
import { Interval, INTERVAL, IntervalName, IntervalProps } from '@packages/interval';
import { Note, NOTE, NoteMidi, NoteName, NoteProps } from '@packages/note';

import { Pc } from './properties';
import { EmptyPc } from './theory';
import { PcChroma, PcNum, PcProperties, PcInit } from './types';

const { compact, range, rotate, toBinary } = BaseArray;
const { both } = BaseBoolean;
const { inSegment, eq } = BaseRelations;
const { isNumber, isObject, isUndefinedOrNull } = BaseTypings;
const { isName: isNoteName } = NOTE.Validators;
const { isIntervalName } = INTERVAL.Validators;

export const Validators = {
  isPcNum: (set: any): set is PcNum => set && isNumber(set) && inSegment(0, 4095, set),
  isPcChroma: (set: any): set is PcChroma => /^[01]{12}$/.test(set),
  isPcSet: (set: any): set is PcProperties => isObject(set) && Validators.isPcChroma(set.chroma),
  isNoteArray: (notes: NoteName[]) => {
    return notes && notes.reduce((acc, value) => acc && isNoteName(value), true);
  },
  isIntervalArray: (intervals: IntervalName[]) => {
    return intervals && intervals.reduce((acc, value) => acc && isIntervalName(value), true);
  },
  isNoteName,
  isIntervalName,
};

export const Methods = {
  /**
   * Rotates chroma string so that it starts with 1
   * @param {PcChroma} chroma
   * @return {PcChroma}
   */
  normalize(chroma: PcChroma): PcChroma {
    const tonicPosition = chroma.indexOf('1');
    return chroma.slice(tonicPosition, 12) + chroma.slice(0, tonicPosition);
  },

  /**
   * Get a list of all possible pitch class sets (all possible chromas) *having C as root*.
   * There are 2048 different chromas.
   * If len is provided it filters to those PcsetChromas of length == len
   *
   * @see http://allthescales.org/
   * @param {number} len
   * @return {Array<PcChroma>} an array of possible chromas from '10000000000' to '11111111111'
   */
  chromaList(len?: number): PcChroma[] {
    const all: PcChroma[] = range(2048, 4095).map(toBinary);
    return len === undefined ? all.slice() : all.filter(chroma => Pc({ chroma }).length === len);
  },

  /**
   * Produce the rotations
   * of the chroma discarding the ones that starts with "0" (normalize=true)
   *
   * @param {PcInit} set - the list of notes or pitchChr of the set
   * @param {boolean} [normalize] - Use only strings with leading '1'
   * @return {Array<string>} modes array
   */
  modes(set: PcInit, normalized = true): PcChroma[] {
    const pcs = Pc(set);
    const binary = pcs.chroma.split('');

    return compact(
      binary.map((b, i) => {
        // make rotation starting with i
        const r = rotate(i, binary);
        // if we want normalized array, then we accept only those starting with r[0] === '1'
        return normalized && r[0] === '0' ? null : r.join('');
      }),
    );
  },

  /**
   * Test if two pitch class sets are identical
   *
   * @param {Array<PcInit>} one
   * @param {Array<PcInit>} other
   * @return {boolean} true if they are equal
   *
   * @example
   * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
   */
  isEqual(one: PcInit, other: PcInit) {
    return eq(Pc(one).pcnum, Pc(other).pcnum);
  },

  /**
   * Create a function that test if a collection of notes is a
   * subset of a given set
   *
   * The function is curryfied.
   *
   * @param {PcInit} set - the superset to test against (chroma or list of notes)
   * @param {PcInit} notes - the subset to test (chroma or list of notes)
   * @return {boolean}
   *
   * @example
   * const inCMajor = Pcset.isSubsetof(["C", "E", "G"])
   * inCMajor(["C"])  // => true
   * inCMajor(["A#"]) // => false
   */
  isSubsetOf: (set: PcInit) => (notes: PcInit) => {
    const s = Pc(set).pcnum;
    const o = Pc(notes).pcnum;

    return s !== o && (o & s) === o;
  },

  /**
   * Create a function that test if a collection of notes is a
   * superset of a given set (it contains all notes and at least one more)
   *
   * @param {PcInit} set - the subset to test against (chroma or list of notes)
   * @param {PcInit} notes - the subset to test (chroma or list of notes)
   * @return {boolean}
   *
   * @example
   * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
   * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
   * extendsCMajor(["c6", "e4", "g3"]) // => false
   */
  isSupersetOf: (set: PcInit) => (notes: PcInit) => {
    const s = Pc(set).pcnum;
    const o = Pc(notes).pcnum;

    return s !== o && (o | s) === o;
  },

  /**
   * Transpose a note by an interval. The note can be a pitch class.
   *
   * This function can be partially applied.
   *
   * @param {NoteName} note
   * @param {IntervalName} interval
   * @param {boolean} useSharps
   * @return {NoteName} the transposed note
   * @example
   * import { tranpose } from "tonal-distance"
   * transpose("d3", "3M") // => "F#3"
   * // it works with pitch classes
   * transpose("D", "3M") // => "F#"
   * // can be partially applied
   * ["C", "D", "E", "F", "G"].map(transpose("M3")) // => ["E", "F#", "G#", "A", "B"]
   */
  transpose: (...args: string[]): any => {
    if (args.length === 1) {
      return (name: NoteName) => Methods.transpose(name, args[0]);
    }
    const [n, i, useSharps] = args;
    const sharps = useSharps === 'true' ? true : false;
    const note = Note && Note({ name: n, sharps });
    const interval = Interval({ name: i });

    if (!both(note.valid, interval.valid)) return undefined;

    const amount: NoteMidi = note.midi + interval.width;

    return Note({ midi: amount, sharps });
  },
};

export const Chroma = {
  toNum: (chroma: PcChroma): PcNum => parseInt(chroma, 2),
  toIntervals: (chroma: PcChroma): IntervalName[] => {
    const notNull = value => !isUndefinedOrNull(value);
    const toIvl = (val, i) => (val === '1' ? Interval({ width: i }).name : null);
    return chroma
      .split('')
      .map(toIvl)
      .filter(notNull);
  },
  toSet: (chroma: PcChroma): PcProperties => {
    const pcnum = Chroma.toNum(chroma);
    const normalized = Methods.normalize(chroma);
    const intervals = Chroma.toIntervals(chroma);

    let length = 0;

    for (let i = 0; i < 12; i++) {
      if (chroma.charAt(i) === '1') length++;
    }

    return { pcnum, chroma, normalized, intervals, length };
  },

  fromNum: (num: PcNum): PcChroma =>
    Number(num)
      .toString(2)
      .padStart(12, '0'),
  fromNotes: (set: NoteName[]): PcChroma => {
    if (set.length === 0) {
      return EmptyPc.chroma;
    }

    const binary = Array(12).fill(0);

    for (let i = 0; i < set.length; i++) {
      const pitch = Note({ name: set[i] }) as NoteProps;

      if (pitch.valid) {
        binary[pitch.chroma] = 1;
      }
    }
    return binary.join('');
  },
  fromIntervals: (set: IntervalName[]): PcChroma => {
    if (set.length === 0) {
      return EmptyPc.chroma;
    }

    const binary = Array(12).fill(0);

    for (let i = 0; i < set.length; i++) {
      const pitch = Interval({ name: set[i] }) as IntervalProps;

      if (pitch.valid) {
        binary[pitch.chroma] = 1;
      }
    }
    return binary.join('');
  },
};
