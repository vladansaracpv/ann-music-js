import { ChordType, ChordProps } from './types';
import { Interval } from '@packages/interval';
import { Note, NoteProps } from '@packages/note';
import { PC } from '@packages/pc';
import { BaseArray } from 'ann-music-base';
import * as Methods from './methods';
import * as Dictionary from './dictionary';

const { rotate } = BaseArray;
const { transpose: transposeNote } = PC.Methods;

export const EmptyChordType: ChordType = {
  pc: PC.EmptyPc,
  type: '',
  quality: 'Unknown',
  aliases: [],
  intervals: [],
};

export const EmptyChord: ChordProps = {
  pc: PC.EmptyPc,
  type: '',
  quality: 'Unknown',
  name: '',
  tonic: '',
  aliases: [],
  notes: [],
  intervals: [],
  formula: '',
  length: 0,
  valid: false,
};

const chordType = (type: string): ChordType => Dictionary.CHORDS[type] as ChordType;

export function Chord(src: string): ChordProps {
  const [cletter, ctype] = Methods.tokenize(src);

  const root = Note({ name: cletter });

  let { type, aliases, intervals, quality, pc } = chordType(ctype);

  if (!intervals.length) {
    return EmptyChord;
  }

  const chromaArr = pc.chroma.split('');
  const chroma = root.valid ? rotate(-root.chroma, chromaArr).join('') : pc.chroma;
  pc.chroma = chroma;

  const tonic = root.letter || '';

  const name = `${tonic} ${type}`.trimLeft();

  const notes: string[] = root.valid ? intervals.map(i => (transposeNote(root.name, i) as NoteProps).pc) : [];

  const formula = intervals.map(ivl => Interval({ name: ivl }).width).join('-');

  const length = intervals.length;

  const valid = true;

  return Object.freeze({
    // ChordType
    pc,
    type,
    quality,
    aliases,
    intervals,
    // ChordProps
    tonic,
    name,
    notes,
    formula,
    length,
    valid,
  });
}
