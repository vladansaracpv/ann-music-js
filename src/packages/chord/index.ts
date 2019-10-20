import { either } from '@packages/base/boolean';
import { tokenize as tokenizeNote } from '@packages/base/strings';
import { Interval, IntervalName } from '@packages/interval';
import { Note, NoteName } from '@packages/note';
import {
  EmptySet,
  isSubsetOf,
  isSupersetOf,
  PcChroma,
  PcNum,
  PcProps,
  pcset,
  transpose as transposeNote,
} from '@packages/pc';
import { entries as scaleTypes } from '@packages/scale';

import CHORDS from './data';

export type ChordQuality = 'Major' | 'Minor' | 'Augmented' | 'Diminished' | 'Unknown' | 'Other';

/**
 * type: ChordTypeName = 'm' | '100100010000' | 2320
 */
export type ChordTypeName = string | PcChroma | PcNum;

/**
 * name: ChordName = 'm' | 'Cm'
 */
export type ChordName = string;

export type ChordNameTokens = [NoteName, ChordTypeName];

/**
 * PcProps := {empty, num, chroma, normalized, length}
 */
export interface ChordType extends PcProps {
  name: string;
  quality: ChordQuality;
  intervals: IntervalName[];
  aliases: string[];
}

/**
 * ChordType := {empty, num, chroma, normalized, length, name, quality, intervals, aliases}
 */
export interface Chord extends ChordType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
  valid: boolean;
}
/**
 * Chord := {empty, num, chroma, normalized, length, name, quality, intervals, aliases, tonic, type, notes}
 */

namespace Theory {
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                        TRIADS                           *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  export const NoChordType: Chord = {
    ...EmptySet,
    name: '',
    quality: 'Unknown',
    intervals: [],
    aliases: [],
    tonic: '',
    type: '',
    notes: [],
    valid: false,
  };

  export const NoChord: Chord = {
    empty: true,
    name: '',
    type: '',
    tonic: null,
    num: NaN,
    length: 0,
    quality: 'Unknown',
    chroma: '',
    normalized: '',
    aliases: [],
    notes: [],
    intervals: [],
    valid: false,
  };

  export const TRIAD_TYPES = ['Major', 'minor', 'Augmented', 'diminished', 'suspended'];

  export const MAJOR = {
    name: 'Major',
    formula: '1P 3M 5P'.split(' '),
    notation: 'M maj  '.split(' '),
  };

  export const MINOR = {
    name: 'minor',
    formula: '1P 3m 5P'.split(' '),
    notation: 'm min'.split(' '),
  };

  export const AUGMENTED = {
    name: 'Augmented',
    formula: '1P 3M 5A'.split(' '),
    notation: 'aug +'.split(' '),
  };

  export const DIMINISHED = {
    name: 'diminished',
    formula: '1P 3m 5d'.split(' '),
    notation: 'dim °'.split(' '),
  };

  export const TRIADS = {
    MAJOR,
    MINOR,
    AUGMENTED,
    DIMINISHED,
  };

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                      SEVEN CHORDS                       *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */
  export const SEVENTHS_TYPES = [
    'diminished',
    'half-diminished',
    'minor',
    'minor-major',
    'dominant',
    'major',
    'augmented',
  ];

  export const DIMINISHED7 = {
    name: 'diminished seventh',
    formula: '1P 3m 5d 7d'.split(' '),
    notation: 'dim7 °7 o7'.split(' '),
  };

  export const HALF_DIMINISHED7 = {
    name: 'half-diminished',
    formula: '1P 3m 5d 7m'.split(' '),
    notation: 'm7b5 ø'.split(' '),
  };

  export const MINOR7 = {
    name: 'minor seventh',
    formula: '1P 3m 5P 7m'.split(' '),
    notation: 'm7 min7 mi7 -7'.split(' '),
  };

  export const MINOR_MAJOR7 = {
    name: 'minor/major seventh',
    formula: '1P 3m 5P 7M'.split(' '),
    notation: 'm/ma7 m/maj7 mM7 m/M7 -Δ7 mΔ'.split(' '),
  };

  export const DOMINANT7 = {
    name: 'dominant seventh',
    formula: '1P 3M 5P 7m'.split(' '),
    notation: '7 dom'.split(' '),
  };

  export const MAJOR7 = {
    name: 'major seventh',
    formula: '1P 3M 5P 7M'.split(' '),
    notation: 'maj7 Δ ma7 M7 Maj7'.split(' '),
  };

  export const AUGMENTED7 = {
    name: 'augmented seventh',
    formula: '1P 3M 5A 7M'.split(' '),
    notation: 'maj7#5 maj7+5'.split(' '),
  };

  export const SEVENTHS = {
    DIMINISHED7,
    HALF_DIMINISHED7,
    MINOR7,
    MINOR_MAJOR7,
    DOMINANT7,
    MAJOR7,
    AUGMENTED7,
  };
}

const chords: ChordType[] = CHORDS.map(dataToChordType);

chords.sort((a, b) => a.num - b.num);

const index: Record<ChordTypeName, ChordType> = chords.reduce((index: Record<ChordTypeName, ChordType>, chord) => {
  if (chord.name) {
    index[chord.name] = chord;
  }
  index[chord.num] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach(alias => {
    index[alias] = chord;
  });
  return index;
}, {});

/**
 * Given a chord name or chroma, return the chord properties
 * @param {ChordTypeName} type - chord name or pitch class set chroma
 * @return ChordType
 */
export function chordType(type: ChordTypeName): ChordType {
  return index[type] || Theory.NoChordType;
}

/**
 * Return a list of all chord types
 */
export function entries(): ChordType[] {
  return chords.slice();
}

function getQuality(intervals: IntervalName[]): ChordQuality {
  const has = (interval: IntervalName) => intervals.indexOf(interval) !== -1;
  return has('5A') ? 'Augmented' : has('3M') ? 'Major' : has('5d') ? 'Diminished' : has('3m') ? 'Minor' : 'Other';
}

function dataToChordType([ivls, name, abbrvs]: string[]) {
  const intervals = ivls.split(' ');
  const aliases = abbrvs.split(' ');
  const quality = getQuality(intervals);
  const set = pcset && pcset(intervals);
  return { ...set, name, quality, intervals, aliases };
}

// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
const NUM_TYPES = /^(6|64|7|9|11|13)$/;

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

/**
 * Get a Chord from a chord name.
 */
export function Chord(src: ChordName | ChordNameTokens): Chord {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = Note(tokens[0] as NoteName);
  const st = chordType(tokens[1]);

  if (st.empty || src === '') {
    return Theory.NoChord;
  }

  const type = st.name;
  const notes: string[] = tonic.valid ? st.intervals.map(i => transposeNote(tonic.name, i)) : [];

  const name = tonic.valid ? tonic.letter + ' ' + type : type;

  const valid = true;

  return { ...st, name, type, tonic: either(tonic.letter, '', tonic.valid), notes, valid };
}

/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */
export function transposeByInterval(chordName: ChordName, interval: string): string {
  const [tonic, type] = tokenize(chordName);
  if (!tonic) {
    return name;
  }
  return transposeNote(tonic, interval)[0] + type;
}

/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */
export function chordScales(name: string): string[] {
  const s = Chord(name);
  const isChordIncluded = isSupersetOf(s.chroma);
  return scaleTypes()
    .filter(scale => isChordIncluded(scale.chroma))
    .map(scale => scale.name);
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
export function chordSuperset(chordName: string): string[] {
  const s = Chord(chordName);
  const isSuperset = isSupersetOf(s.chroma);
  return entries()
    .filter(chord => isSuperset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
}

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */
export function chordSubset(chordName: string): string[] {
  const s = Chord(chordName);
  const isSubset = isSubsetOf(s.chroma);
  return entries()
    .filter(chord => isSubset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
}

/**
 * Get chord formula from chord name
 *
 * @function
 * @param {ChordName} src - the chord name
 * @return {Array<number>} the transposed chord
 * @example
 * chordFormula("Maj7")
 * // => [0, 4, 7, 11]
 */
export const chordFormula = (src: ChordName) => {
  const props = Chord(src);
  return props.intervals.map(ivl => Interval(ivl).semitones);
};
