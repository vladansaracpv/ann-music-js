import { midi } from './properties';
import { NAME } from './factories/name';
import { inc, sub1, compose, add, sub } from '../helpers';

const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
const STEPS_REGEX = /^(steps|step|s)?$/;
const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;

const isOctave = (amount: string) => OCTAVE_REGEX.test(amount);
const isStep = (amount: string) => STEPS_REGEX.test(amount);
const isSemitone = (amount: string) => SEMI_REGEX.test(amount);
const parseNum = (amount: string) => Number.parseInt(amount);

export const semitones = (...args) => {
  const [semitones, note] = args;

  return args.length === 1
    ? (note: string) => semitones(semitones, note)
    : NAME.fromMidi(midi(note) + semitones);
};
export const tones = (...args) => {
  const [amount, note] = args;

  return args.length === 1
    ? (amount: number) => tones(amount, note)
    : semitones(2 * amount, note);
};
export const octaves = (...args) => {
  const [amount, note] = args;

  return args.length === 1
    ? (amount: number) => octaves(amount, note)
    : semitones(12 * amount, note);
};

export const parseAmount = (amount: string): number => {
  if (amount.length === 0) return 1;
  if (isSemitone(amount)) return 1;
  if (isStep(amount)) return 6;
  if (isOctave(amount)) return 12;

  return 0;
};
export const transpose = (...args) => {
  const [by, note] = args;
  if (args.length === 1) return (note: string) => transpose(by, note);
  const unitAmount = by.split(' ');
  const [amount, unit] = unitAmount;

  return semitones(parseNum(amount) * parseAmount(unit), note);
};
export const next = (note: string) => compose(NAME.fromMidi, inc, midi)(note);
export const prev = (note: string) => compose(NAME.fromMidi, sub1, midi)(note);
export const nextBy = (...args) => {
  const [amount, note] = args;

  return args.length === 1
    ? (note: string) => nextBy(amount, note)
    : compose(NAME.fromMidi, add(amount), midi)(note);
};
export const prevBy = (...args) => {
  const [amount, note] = args;

  return args.length === 1
    ? (note: string) => prevBy(amount, note)
    : compose(NAME.fromMidi, sub(amount), midi)(note);
};
