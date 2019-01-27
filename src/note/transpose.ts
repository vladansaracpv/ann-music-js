import { midi } from './properties';
import { NAME } from './factories/name';

/* Transpose @note by number of @semitones */
export const semitones = (...args) => {
  const [semitones, note] = args;
  if (args.length === 1) return note => semitones(semitones, note);

  return NAME.fromMidi(midi(note) + semitones);
};

/* Transpose @note by number of @tones */
export const tones = (...args) => {
  const [tones, note] = args;
  if (args.length === 1) return tones => tones(tones, note);

  return semitones(2 * tones, note);
};

/* Transpose @note by number of @octaves */
export const octaves = (...args) => {
  const [octaves, note] = args;
  if (args.length === 1) return octaves => octaves(octaves, note);

  return semitones(12 * octaves, note);
};

/* Parse units used for transpose */
export const parseAmount = amount => {
  const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
  const STEPS_REGEX = /^(steps|step|s)?$/;
  const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;

  if (amount.length === 0) return 1;
  if (OCTAVE_REGEX.test(amount)) return 12;
  if (STEPS_REGEX.test(amount)) return 6;
  if (SEMI_REGEX.test(amount)) return 1;

  return 0;
};

/* Transpose note @note by ammount @by */
export const transpose = (...args) => {
  const [by, note] = args;
  if (args.length === 1) return note => transpose(by, note);

  const unitAmount = by.split(' ');
  const [amount, unit] = [
    Number.parseInt(unitAmount[0]),
    parseAmount(unitAmount[1])
  ];
  return semitones(amount * unit, note);
};

/* Get next note by incrementing MIDI */
export const next = note => NAME.fromMidi(midi(note) + 1);

/* Get prev note by decrementing MIDI */
export const prev = note => NAME.fromMidi(midi(note) - 1);

/* Get note @n steps ahead */
export const nextBy = (...args) => {
  const [amount, note] = args;

  if (args.length === 1) return note => nextBy(amount, note);

  const newMidi = midi(note) + amount;

  return NAME.fromMidi(newMidi);
};

/* Get note @n steps behind */
export const prevBy = (...args) => nextBy(...args);
