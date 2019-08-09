import { EmptySet } from '@packages/pc';
import { tokenize as tokenizeNote } from '@base/strings';
import { NOTE_REGEX } from '@packages/note/theory';
import { Note } from '@packages/note/factories';
import { chordType, entries as chordTypes } from './dictionary';
import { transpose as transposeNote, isSubsetOf, isSupersetOf, modes } from '@packages/pc';
import { either } from '@base/boolean';
import { entries as scaleTypes } from '@packages/scale/dictionary';

const NoChord: Chord = {
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
};

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
  const NOTE_REGEX = /^(?<Tletter>[a-gA-G]?)(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)\s*(?<Trest>.*)$/;
  const { Tletter: lt, Taccidental: acc, Toct: oct, Trest: type } = tokenizeNote(name, NOTE_REGEX);
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
export function chord(src: ChordName | ChordNameTokens): Chord {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = Note({ name: tokens[0] });
  const st = chordType(tokens[1]);

  if (st.empty || src === '') {
    return NoChord;
  }

  const type = st.name;
  const notes: string[] = tonic.valid ? st.intervals.map(i => transposeNote(tonic.name, i)) : [];

  const name = tonic.valid ? tonic.letter + ' ' + type : type;

  return { ...st, name, type, tonic: either(tonic.letter, '', tonic.valid), notes };
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
export function transpose(chordName: string, interval: string): string {
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
  const s = chord(name);
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
export function extended(chordName: string): string[] {
  const s = chord(chordName);
  const isSuperset = isSupersetOf(s.chroma);
  return chordTypes()
    .filter(chord => isSuperset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
}

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */
export function reduced(chordName: string): string[] {
  const s = chord(chordName);
  const isSubset = isSubsetOf(s.chroma);
  return chordTypes()
    .filter(chord => isSubset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
}
