import { IntervalName } from '@packages/interval';
import { Pc } from '@packages/pc';

import CHORD_LIST from './data';
import { ChordType } from './types';

type ChordTypes = Record<string, ChordType>;

function chordQuality(intervals: IntervalName[]) {
  const has = (interval: IntervalName) => intervals.includes(interval);
  return has('5A') ? 'Augmented' : has('3M') ? 'Major' : has('5d') ? 'Diminished' : has('3m') ? 'Minor' : 'Other';
}

function toChordType([ivls, type, abbrvs]: string[]): ChordType {
  const aliases = abbrvs.split(' ');
  const intervals = ivls.split(' ');
  const quality = chordQuality(intervals);
  const { pcnum, chroma, normalized } = Pc({ intervals });

  return {
    pc: { pcnum, chroma, normalized },
    type,
    quality,
    intervals,
    aliases,
  };
}

function toChords(types: ChordType[]) {
  return types.reduce((chords: ChordTypes, chord: ChordType) => {
    chords[chord.type] = chord;
    chord.aliases.forEach(alias => {
      chords[alias] = chord;
    });

    return chords;
  }, {}) as ChordTypes;
}

export const CHORD_TYPES: ChordType[] = CHORD_LIST.map(toChordType);
export const CHORDS: ChordTypes = toChords(CHORD_TYPES);

export const chordTypesList = CHORD_TYPES.map(chord => chord.aliases[0]);
