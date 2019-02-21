import { curry, glue, isEither, compose, addC, addN, mod, divC, mulC, floor, subC, pow2, eq, geq } from '../helpers';
import { EMPTY_NOTE, parseNote, LETTERS, WHITES, WITH_SHARPS, WITH_FLATS } from './theory';


const mod12 = mod(12);
const div12 = divC(12);
const mul12 = mulC(12);
const sub1 = subC(1);
const sub69 = subC(69);
const add1 = addC(1);
const getStepForLetter = (LETTERS: string, letter: string): number => LETTERS.indexOf(letter);
const getAccidentalValue = (acc: string) => isEither(-acc.length, acc.length, eq(acc[0], 'b'));
const getChroma = (WHITES: number[], step: number, alteration: number): number => mod12(addN(WHITES[step], alteration, 12));
const getPc = (letter: string, accidental: string): string => glue(letter, accidental);
const getName = (pc: string, octave: number): string => glue(pc, octave);
const getMidi = (chroma: number, octave: number): number => compose(addC(chroma), mul12, add1)(octave);
const getFreqFromMidi = (midi: number, tuning = 440): number => compose(pow2, div12, sub69)(midi) * tuning;
const getNameFromMidi = (midi: number, sharps: string[], flats: string[], useSharps = true): string => {
  const index = mod12(midi);
  const octave = compose(sub1, floor, div12)(midi);
  const pc = isEither(sharps[index], flats[index], useSharps);
  return glue(pc, octave);
};

export const getNoteProps = (noteName: string): any => {
  const tokens = parseNote(noteName);
  if (!tokens) { return EMPTY_NOTE; }

  const { letter, accidental, octave } = tokens;

  const step = getStepForLetter(LETTERS, letter);
  const alteration = getAccidentalValue(accidental);
  const chroma = getChroma(WHITES, step, alteration);
  const pc = getPc(letter, accidental);
  const name = getName(pc, octave);
  const midi = getMidi(chroma, octave);
  const frequency = isEither(getFreqFromMidi(midi), undefined, !!midi);

  return {
    ...EMPTY_NOTE,
    name,
    letter,
    step,
    accidental,
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
    enharmonic: '',
  };
};

export const property = curry((name: string, note: string) => getNoteProps(note)[name]);

export const name = (note: string) => getNoteProps(note).name;
export const letter = (note: string) => getNoteProps(note).letter;
export const step = (note: string) => getNoteProps(note).step;
export const accidental = (note: string) => getNoteProps(note).accidental;
export const alteration = (note: string) => getNoteProps(note).alteration;
export const octave = (note: string) => getNoteProps(note).octave;
export const pc = (note: string) => getNoteProps(note).pc;
export const chroma = (note: string) => getNoteProps(note).chroma;
export const midi = (note: string) => getNoteProps(note).midi;
export const frequency = (note: string) => getNoteProps(note).frequency;

export const simplify = (note: string, withSameAccidentals = true): string => {
  const [midi, alteration] = getNoteProps(note);
  const hasSharps = geq(0, alteration);
  const useSharps = isEither(hasSharps, !hasSharps, withSameAccidentals);

  return getNameFromMidi(midi, WITH_SHARPS, WITH_FLATS, useSharps);
};

export const enharmonic = (note: string): string => simplify(note, false);
