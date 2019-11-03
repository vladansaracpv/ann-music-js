import { BaseBoolean, BaseStrings, BaseTypings, BaseArray } from 'ann-music-base';
import { NoteName, Note } from 'ann-music-note';
import { Interval, IntervalName } from 'ann-music-interval';
import {
  EmptySet,
  isSubsetOf,
  isSupersetOf,
  PcsetChroma,
  PcsetNum,
  PcsetProps,
  pcset,
  transpose as transposeNote,
} from 'ann-music-pc';

const { either } = BaseBoolean;
const { tokenize: tokenizeNote } = BaseStrings;
const { isArray, isString } = BaseTypings;
const { rotate } = BaseArray;

import CHORD_LIST from './data';

export type ChordQuality = 'Major' | 'Minor' | 'Augmented' | 'Diminished' | 'Unknown' | 'Other';

/**
 * Chord name (may include tonic note)
 *
 * @example
 *
 * const cminor: ChordTypeName = 'Cm'
 * const minor: ChordTypeName = 'm'
 */
export type ChordTypeName = string;
export type ChordTypeChroma = PcsetChroma;
export type ChordTypeSetNum = PcsetNum;

/**
 * ChordTypeProp Can be given either as ChordTypeName | PcsetChroma | PcsetNum
 *
 * @example
 * const chord: ChordTypeProp = 'C major'
 * const chordChroma: ChordTypeProp = '100100010000'
 * const chordSetNum: ChordTypeProp = 2386
 */
export type ChordTypeProp = ChordTypeName | ChordTypeChroma | ChordTypeSetNum;

/**
 * ChordNameTokens represent tuple of [NoteName, ChordTypeProp]
 *
 * @example
 * const tokens: ChordNameTokens = ['C', 'minor']
 */
export type ChordNameTokens = [NoteName, ChordTypeProp];

export type ChordInit = ChordTypeName | ChordNameTokens;
/**
 * aliases
 * chroma,
 * empty,
 * intervals,
 * length,
 * name,
 * normalized,
 * quality,
 * setNum,
 */
export interface ChordType extends PcsetProps {
  name: string;
  quality: ChordQuality;
  aliases: string[];
}

/**
 * aliases
 * chroma,
 * empty,
 * intervals,
 * length,
 * name,
 * normalized,
 * notes,
 * quality,
 * setNum,
 * tonic,
 * type,
 * valid
 */
export interface Chord extends ChordType {
  tonic: string;
  type: string;
  notes: NoteName[];
  valid: boolean;
}

export type ChordTypes = Record<ChordTypeProp, ChordType>;

namespace Theory {
  export const NoChordType: ChordType = {
    ...EmptySet,
    name: '',
    quality: 'Unknown',
    aliases: [],
  };

  export const NoChord: Chord = {
    empty: true,
    name: '',
    type: '',
    tonic: null,
    setNum: NaN,
    length: 0,
    quality: 'Unknown',
    chroma: '',
    normalized: '',
    aliases: [],
    notes: [],
    intervals: [],
    valid: false,
  };
}

namespace Transpose {
  const transpose = b => b;
}

namespace SetMethods {
  /**
   * Find all chords names that are a subset of the given one
   * (has less notes but all from the given chord)
   *
   * @example
   */
  export function chordSubset(chordName: ChordTypeName): string[] {
    const s = Chord(chordName);
    const isSubset = isSubsetOf(s.chroma);
    return CHORD.types.filter(chord => isSubset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
  }

  /**
   * Get all chords names that are a superset of the given one
   * (has the same notes and at least one more)
   *
   * @function
   * @example
   * extended("CMaj7")
   * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
   */
  export function chordSuperset(chordName: ChordTypeName): string[] {
    const s = Chord(chordName);
    const isSuperset = isSupersetOf(s.chroma);
    return CHORD.types.filter(chord => isSuperset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
  }
}

namespace Static {
  export function formula(chord: ChordTypeName) {
    const props = Chord(chord);
    return props.intervals.map(ivl => Interval(ivl).semitones);
  }
}

namespace Dictionary {
  export const TYPES: ChordType[] = CHORD_LIST.map(toChordType).sort(
    (a: ChordType, b: ChordType) => a.setNum - b.setNum,
  ) as ChordType[];
  export const CHORDS: ChordTypes = toChords(TYPES);

  export function toChords(types: ChordType[]) {
    return types.reduce((chords: ChordTypes, chord: ChordType) => {
      chords[chord.name] = chord;
      chords[chord.setNum] = chord;
      chords[chord.chroma] = chord;
      chord.aliases.forEach(alias => {
        chords[alias] = chord;
      });
      return chords;
    }, {}) as ChordTypes;
  }

  export function toChordType([ivls, name, abbrvs]: string[]): ChordType {
    const has = (interval: IntervalName) => ivls.includes(interval);
    const intervals = ivls.split(' ');
    const set = pcset(intervals);
    const aliases = abbrvs.split(' ');
    const quality = has('5A')
      ? 'Augmented'
      : has('3M')
      ? 'Major'
      : has('5d')
      ? 'Diminished'
      : has('3m')
      ? 'Minor'
      : 'Other';
    return { ...set, name, quality, intervals, aliases };
  }

  /**
   * Tokenize a chord name. It returns an array with the tonic and chord type
   * If not tonic is found, all the name is considered the chord name.
   *
   * This function does NOT check if the chord type exists or not. It only tries
   * to split the tonic and chord type.
   *
   * @function
   * @param {string} name - the chord name
   * @return {Array} an array with [tonic, type]
   * @example
   * tokenize("Cmaj7") // => [ "C", "maj7" ]
   * tokenize("C7") // => [ "C", "7" ]
   * tokenize("mMaj7") // => [ null, "mMaj7" ]
   * tokenize("Cnonsense") // => [ null, "nonsense" ]
   */
  export function tokenize(name: string): ChordNameTokens {
    // 6, 64, 7, 9, 11 and 13 are consider part of the chord
    // (see https://github.com/danigb/tonal/issues/55)
    const NUM_TYPES = /^(6|64|7|9|11|13)$/;
    const REGEX = /^(?<Tletter>[a-gA-G]?)(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)\s*(?<Trest>.*)$/;
    const { Tletter: lt, Taccidental: acc, Toct: oct, Trest: type } = tokenizeNote(name, REGEX);
    if (lt === '') {
      return ['', name];
    }
    // aug is augmented (see https://github.com/danigb/tonal/issues/55)
    if (lt === 'A' && type === 'ug') {
      return ['', 'aug'];
    }
    // see: https://github.com/tonaljs/tonal/issues/70
    if (!type && (oct === '4' || oct === '5')) {
      return [lt + acc, oct];
    }

    if (NUM_TYPES.test(oct)) {
      return [lt + acc, oct + type];
    } else {
      return [lt + acc + oct, type];
    }
  }
}

export const CHORD = {
  types: Dictionary.TYPES,
  chords: Dictionary.CHORDS,
  ...Static,
  ...Transpose,
  ...SetMethods,
};

/**
 * Get a Chord from a chord name.
 */
export function Chord(src: ChordInit): Chord {
  function fromTokens(ctokens: ChordNameTokens) {
    const [cname, ctype] = ctokens;
    const tonic = Note(cname as NoteName);

    const st = CHORD.chords[ctype] || Theory.NoChordType;
    if (st.empty) {
      return Theory.NoChord;
    }

    const chroma = rotate(-tonic.chroma, st.chroma.split('')).join('');
    const chType = { ...st, chroma };

    const type = st.name;
    const notes: string[] = tonic.valid ? st.intervals.map(i => transposeNote(tonic.name, i).pc) : [];

    const name = tonic.valid ? tonic.letter + ' ' + type : type;

    const valid = true;

    return { ...chType, name, type, tonic: either(tonic.letter, '', tonic.valid), notes, valid };
  }

  function fromName(name: ChordTypeName) {
    const tokenizeName = Dictionary.tokenize;
    const tokens = tokenizeName(name) as ChordNameTokens;
    return fromTokens(tokens);
  }

  if (isString(src)) return fromName(src);
  if (isArray(src)) return fromTokens(src);
  return Theory.NoChord;
}
