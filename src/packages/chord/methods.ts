import { Interval } from '@packages/interval';
import { Chord } from './properties';
import { CHORD_TYPES } from './dictionary';
import { BaseStrings, BaseRelations } from 'ann-music-base';
import { PC } from '@packages/pc';
import { NoteName, Note } from '@packages/note';

const { tokenize: tokenizeNote } = BaseStrings;
const { isSubsetOf, isSupersetOf } = PC.Methods;
const { eq, neq } = BaseRelations;

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
export function tokenize(name: string): string[] {
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

export function formula(chord: string) {
  const props = Chord(chord);
  return props.intervals.map(ivl => Interval({ name: ivl }).width);
}

/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {NoteName[]} names
 * @return {NoteName[]} array of scale notes
 *
 * @example
 * notes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * notes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */
export function notes(names: NoteName[]): NoteName[] {
  return names
    .map(n => Note({ name: n }))
    .filter(n => n.valid)
    .sort((a, b) => a.midi - b.midi)
    .map(n => n.pc)
    .filter((n, i, a) => eq(i, 0) || neq(n, a[i - 1]));
}

/**
 * Find all chords names that are a narrow of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */
export function reduced(chordName: string): string[] {
  const s = Chord(chordName);
  const isSubset = isSubsetOf({ chroma: s.pc.chroma });
  return CHORD_TYPES.filter(chord => isSubset({ chroma: chord.pc.chroma })).map(chord => s.tonic + chord.aliases[0]);
}

/**
 * Get all chords names that are a extended of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */
export function extended(chordName: string): string[] {
  const s = Chord(chordName);
  const isSuperset = isSupersetOf({ chroma: s.pc.chroma });
  return CHORD_TYPES.filter(chord => isSuperset({ chroma: chord.pc.chroma })).map(chord => s.tonic + chord.aliases[0]);
}
