import { BaseBoolean, BaseStrings, BaseTypings, BaseArray, BaseRelations } from 'ann-music-base';
import { NoteName, Note, NoteProps } from 'ann-music-note';
import { Interval, IntervalName } from 'ann-music-interval';
import { PcChroma, PcNum, PcProperties, PC, PitchClass } from 'ann-music-pc';
import CHORD_LIST from './data';

const { either } = BaseBoolean;
const { tokenize: tokenizeNote } = BaseStrings;
const { isArray, isString } = BaseTypings;
const { rotate } = BaseArray;
const { eq } = BaseRelations;
const { isSubsetOf, isSupersetOf, transpose: transposeNote } = PitchClass.Methods;
const EmptySet = PitchClass.Empty;

export type ChordQuality = 'Major' | 'Minor' | 'Augmented' | 'Diminished' | 'Unknown' | 'Other';

export type ChordTypeName = string;

export type ChordTypeProp = ChordTypeName | PcChroma | PcNum;

export type ChordNameTokens = [NoteName, ChordTypeProp];

export type ChordInit = ChordTypeName | ChordNameTokens;

export interface ChordType extends PcProperties {
  /**
   * * Added by PcProperties * *
   * setNum,
   * chroma,
   * normalized,
   * intervals,
   * length,
   *
   * * Added by ChordType * *
   * aliases
   * type,
   * quality,
   */
  type: string;
  quality: ChordQuality;
  aliases: string[];
}

export interface Chord extends ChordType {
  /**
   * * Added by PcProperties * *
   * setNum,
   * chroma,
   * normalized,
   * intervals,
   * length,
   *
   * * Added by ChordType * *
   * name,
   * quality,
   * aliases
   *
   * * Added by Chord * *
   * tonic,
   * type,
   * notes,
   * valid
   */
  tonic: string;
  name: string;
  notes: NoteName[];
  formula: string;
  valid: boolean;
}

export type ChordTypes = Record<ChordTypeProp, ChordType>;

namespace Dictionary {
  export const TYPES: ChordType[] = CHORD_LIST.map(toChordType).sort(
    (a: ChordType, b: ChordType) => a.length - b.length,
  ) as ChordType[];

  export const CHORDS: ChordTypes = toChords(TYPES);

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

  function toChords(types: ChordType[]) {
    return types.reduce((chords: ChordTypes, chord: ChordType) => {
      chords[chord.type] = chord;
      chords[chord.setNum] = chord;
      chords[chord.chroma] = chord;
      chord.aliases.forEach(alias => {
        chords[alias] = chord;
      });
      return chords;
    }, {}) as ChordTypes;
  }

  function toChordType([ivls, type, abbrvs]: string[]): ChordType {
    const has = (interval: IntervalName) => ivls.includes(interval);
    const aliases = abbrvs.split(' ');
    const intervals = ivls.split(' ');
    const set = PC(intervals) as PcProperties;
    const quality = has('5A')
      ? 'Augmented'
      : has('3M')
      ? 'Major'
      : has('5d')
      ? 'Diminished'
      : has('3m')
      ? 'Minor'
      : 'Other';
    return { ...set, type, quality, intervals, aliases };
  }
}

export const CHORD = {
  types: Dictionary.TYPES,

  chords: Dictionary.CHORDS,

  EmptyChordType: {
    ...EmptySet,
    type: '',
    quality: 'Unknown',
    aliases: [],
  },

  EmptyChord: {
    name: '',
    type: '',
    tonic: '',
    setNum: NaN,
    length: 0,
    quality: 'Unknown',
    chroma: '',
    normalized: '',
    aliases: [],
    notes: [],
    intervals: [],
    valid: false,
  },

  formula(chord: ChordTypeName) {
    const props = Chord(chord);
    return props.intervals.map(ivl => Interval(ivl).semitones);
  },

  /**
   * Find all chords names that are a subset of the given one
   * (has less notes but all from the given chord)
   *
   * @example
   */
  subChords(chordName: ChordTypeName): string[] {
    const s = Chord(chordName);
    const isSubset = isSubsetOf(s.chroma);
    return CHORD.types.filter(chord => isSubset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
  },

  /**
   * Get all chords names that are a superset of the given one
   * (has the same notes and at least one more)
   *
   * @function
   * @example
   * extended("CMaj7")
   * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
   */
  superChords(chordName: ChordTypeName): string[] {
    const s = Chord(chordName);
    const isSuperset = isSupersetOf(s.chroma);
    return CHORD.types.filter(chord => isSuperset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
  },
};

export function Chord(src: ChordInit): Chord {
  function fromTokens(ctokens: ChordNameTokens) {
    const [chordLetter, ctype] = ctokens;

    const rootNote = Note(chordLetter as NoteName);

    const chordType = (CHORD.chords[ctype] || CHORD.EmptyChordType) as ChordType;

    const { setNum, normalized, intervals, length, type, quality, aliases, chroma: chordChroma } = chordType;

    if (eq(length, 0)) {
      return CHORD.EmptyChord as Chord;
    }

    const chroma = either(rotate(-rootNote.chroma, chordChroma.split('')).join(''), chordChroma, rootNote.valid);

    const tonic = rootNote.letter || '';

    const name = `${tonic} ${type}`.trimLeft();

    const notes: string[] = rootNote.valid ? intervals.map(i => (transposeNote(rootNote.name, i) as NoteProps).pc) : [];

    const formula = intervals.map(ivl => Interval(ivl).semitones).join('-');

    const valid = true;

    return Object.freeze({
      // PcProperties
      setNum,
      chroma,
      normalized,
      intervals,
      length,
      // ToDo: Remove
      empty: eq(length, 0),
      // ChordType
      type,
      quality,
      aliases,
      // Chord
      tonic,
      name,
      notes,
      formula,
      valid,
    });
  }

  function fromName(name: ChordTypeName) {
    const tokens = Dictionary.tokenize(name) as ChordNameTokens;
    return fromTokens(tokens);
  }

  if (isString(src)) return fromName(src);

  if (isArray(src)) return fromTokens(src);

  return CHORD.EmptyChord as Chord;
}
