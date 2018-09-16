import { property, fromMidi } from './properties';
import { compose } from '../helpers';

export const transposeBySemitone = (note, semitones) => {
  const midi = property('midi');
  const midiTransposed = (note, semitones) => midi(note) + semitones;
  return compose(fromMidi, midiTransposed)(note, semitones);
};

export const parseTransAmount = (amount) => {
  // If no string value given, we assume it should be transposed in semitones
  if (amount.length === 0) return 1;

  const isOctave = (
    amount.indexOf('octave') > -1 ||
    amount.indexOf('oct') > -1 ||
    amount.indexOf('o') > -1
  );

  const isSteps = amount.indexOf('steps') > -1;

  const isSemi = (
    amount.indexOf('halfsteps') > -1 ||
    amount.indexOf('half') > -1 ||
    amount.indexOf('semi') > -1 ||
    amount.indexOf('h') > -1
  );

  if (isOctave) return 12;
  if (isSteps) return 6;

  return isSemi ? 1 : 0;

};

export const transposeBy = (note, amount) => {
  const amountVal = amount.split(' ');
  const n = Number.parseInt(amountVal[0]);
  const k = parseTransAmount(amountVal[1] || '');
  return transposeBySemitone(note, n * k);
};
