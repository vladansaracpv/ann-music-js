import { midi } from './properties';
import { compose, add, add2, somethingTrue } from '../helpers';
import { NAME } from './factory';

export class Transpose {

  static semitones = (note: string, semitones: number): string => compose(NAME.fromMidi, add2)(midi(note), semitones);
  static tones = (note: string, tones: number): string => Transpose.semitones(note, 2 * tones);
  static octaves = (note: string, octaves: number): string => Transpose.semitones(note, 12 * octaves);
  static parseAmount = (amount: string): number => {

    const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
    const STEPS_REGEX = /^(steps|step|s)?$/;
    const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;

    if (amount.length === 0) return 1;
    if (OCTAVE_REGEX.test(amount)) return 12;
    if (STEPS_REGEX.test(amount)) return 6;
    if (SEMI_REGEX.test(amount)) return 1;

    return 0;

  };
  static transpose = (note: string, amount: string): string => {
    const amountVal = amount.split(' ');
    const n = Number.parseInt(amountVal[0]);
    const k = Transpose.parseAmount(amountVal[1] || '');
    return Transpose.semitones(note, n * k);
  };
  static next = (x, n = 1) => compose(NAME.fromMidi, compose(add(n), midi))(x);
  static prev = (x, n = 1) => Transpose.next(x, -n);
}
