import { curry, glue, isEither, compose, addC, addN, add, mod, divC, mulC, floor, subC, pow2, eq, geq, pow } from '../helpers';
import { EMPTY_NOTE, parse, LETTERS, WHITES, WITH_SHARPS, WITH_FLATS } from './theory';


const mod12 = mod(12);
const div12 = divC(12);
const mul12 = mulC(12);
const sub1 = subC(1);
const sub69 = subC(69);
const add1 = addC(1);

const baseToneIndex = (LETTERS: string, letter: string): number => LETTERS.indexOf(letter);
const accidentalOffset = (acc: string) => isEither(-acc.length, acc.length, eq(acc[0], 'b'));
const getChroma = (WHITES: number[], step: number, alteration: number): number => mod12(addN(WHITES[step], alteration, 12));

const getOctaveSemitones = (octave: number) => compose(mul12, add1)(octave);
const getMidi = (chroma: number, octave: number): number => add(chroma, getOctaveSemitones(octave));
const getMidiOctaves = (midi: number) => compose(sub1, floor, div12)(midi);
const exponent = (midi: number) => compose(div12, sub69)(midi);
const getMidiFreq = (midi: number, tuning = 440): number => Math.pow(2, exponent(midi)) * tuning;
const getMidiName = (midi: number, sharps: string[], flats: string[], useSharps = true): string => {
  const chroma = mod12(midi);
  const octave = getMidiOctaves(midi);
  const pc = isEither(sharps[chroma], flats[chroma], useSharps);
  return glue(pc, octave);
};

export const getNoteProps = (noteName: string): any => {
  const tokens = parse(noteName);
  if (!tokens) { return EMPTY_NOTE; }

  const { letter, accidental, octave } = tokens;

  const step = baseToneIndex(LETTERS, letter);
  const alteration = accidentalOffset(accidental);
  const chroma = getChroma(WHITES, step, alteration);
  const pc = glue(letter, accidental);
  const name = glue(pc, octave)
  const midi = getMidi(chroma, octave);
  const frequency = isEither(getMidiFreq(midi), undefined, !!midi);

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

  return getMidiName(midi, WITH_SHARPS, WITH_FLATS, useSharps);
};

export const enharmonic = (note: string): string => simplify(note, false);
