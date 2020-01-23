/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                 NOTE - STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

import { BaseBoolean, BaseRelations, BaseFunctional, BaseTypings } from 'ann-music-base';

import { Note } from './properties';
import { FLATS, REGEX, SHARPS } from './theory';
import {
  NoteProps,
  NoteComparableFns,
  NoteInit,
  NoteName,
  NoteProp,
  NoteTransposableProperty,
  NoteMetricProperty,
  CurriedTransposeFn,
  CurriedDistanceFn,
  CurriedCompareFn,
} from './types';

const { both, either } = BaseBoolean;
const { eq, geq, gt, inSegment, isPositive, leq, lt, neq } = BaseRelations;
const { isInteger, isNumber, isString } = BaseTypings;
const { curry } = BaseFunctional;
const CompareFns = { lt, leq, eq, neq, gt, geq };

export const Validators = {
  isChroma: (chroma: any): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
  isFrequency: (freq: any): boolean => isNumber(freq) && gt(freq, 0),
  isMidi: (midi: any): boolean => both(isInteger(midi), inSegment(0, 135, +midi)),
  isName: (name: any): boolean => REGEX.test(name) === true,
  isAccidental: (acc: any): boolean => (isString(acc) ? eq(acc[0].repeat(acc.length), acc) : false),
  isNote: (note: any): boolean => note(note).valid,
};

export const property = (prop: NoteProp) => (note: NoteInit) => Note(note)[prop];

export function simplify(name: NoteName, keepAccidental = true): NoteName {
  const note = Note({ name });

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = isPositive(alteration);

  const useSharps = isSharp === keepAccidental;

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

export function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

function TransposeFn(property: NoteTransposableProperty, amount: number, note: NoteInit): NoteProps {
  const n = Note(note);
  return Note({ [property]: n[property] + amount });
}

function DistanceFn(property: NoteMetricProperty, note: NoteInit, other: NoteInit): number {
  const [n, o] = [Note(note), Note(other)];
  return o[property] - n[property];
}

function CompareFn(fn: NoteComparableFns, property: NoteMetricProperty, note: NoteInit, other: NoteInit): boolean {
  const [n, o] = [Note(note), Note(other)];
  const f = CompareFns[fn];
  return f(n[property], o[property]);
}

export const Transpose: CurriedTransposeFn = curry(TransposeFn);
export const Distance: CurriedDistanceFn = curry(DistanceFn);
export const Compare: CurriedCompareFn = curry(CompareFn);
