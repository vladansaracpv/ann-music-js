import { pcset, EmptySet } from '@packages/pc';
import CHORD_LIST from './data';

const NoChordType: Chord = {
  ...EmptySet,
  name: '',
  quality: 'Unknown',
  intervals: [],
  aliases: [],
  tonic: '',
  type: '',
  notes: [],
};

const chords: ChordType[] = CHORD_LIST.map(dataToChordType);

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
 * @returns ChordType
 */
export function chordType(type: ChordTypeName): ChordType {
  return index[type] || NoChordType;
}

/**
 * Return a list of all chord types
 */
export function entries(): ChordType[] {
  return chords.slice();
}

function getQuality(intervals: IvlName[]): ChordQuality {
  const has = (interval: IvlName) => intervals.indexOf(interval) !== -1;
  return has('5A') ? 'Augmented' : has('3M') ? 'Major' : has('5d') ? 'Diminished' : has('3m') ? 'Minor' : 'Other';
}

function dataToChordType([ivls, name, abbrvs]: string[]) {
  const intervals = ivls.split(' ');
  const aliases = abbrvs.split(' ');
  const quality = getQuality(intervals);
  const set = pcset && pcset(intervals);
  return { ...set, name, quality, intervals, aliases };
}
