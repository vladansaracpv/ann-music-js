import { BaseBoolean, BaseErrors, BaseMaths, BaseRelations, BaseStrings, BaseTypings } from 'ann-music-base';
import { A4_KEY, A_440, SHARPS, REGEX, EmptyNote, FLATS } from './theory';
import { Validators } from './methods';

import {
  NoteAccidental,
  NoteAlteration,
  NoteChroma,
  NoteFreq,
  NoteInit,
  NoteLetter,
  NoteMidi,
  NoteName,
  NoteOctave,
  NotePC,
  NoteProps,
  NoteStep,
} from './types';

const { eq, ltz } = BaseRelations;
const { isInteger } = BaseTypings;
const { CustomError } = BaseErrors;
const { capitalize, substitute, tokenize, uppercaseFirstLetter, head } = BaseStrings;
const { inc, sub, div } = BaseMaths;
const { either } = BaseBoolean;
const NoteError = CustomError('Note');

export class TypeValue {
  type: string;
  value: number;
}

export class NOctave {
  value: number;

  static toSemitones = (octave: number) => 12 * inc(octave);
  static parse = (octave: string) => {
    const parsed = Number.parseInt(octave, 10);
    return isInteger(parsed) ? parsed : 4;
  };

  constructor(octave: string) {
    this.value = NOctave.parse(octave);
  }
}

export class NLetter extends TypeValue {
  static toStep(letter: string) {
    return (letter.charCodeAt(0) + 3) % 7;
  }

  static toIndex(letter: string) {
    return SHARPS.indexOf(letter);
  }

  index: number;

  constructor(letter: string) {
    super();
    this.type = uppercaseFirstLetter(letter);
    this.value = NLetter.toStep(letter);
    this.index = NLetter.toIndex(letter);
  }
}

export class NAccidental extends TypeValue {
  static toAlteration = (accidental: string) => {
    const len = accidental.length;
    const sign = either(-1, 1, eq(head(accidental), 'b'));

    return len * sign;
  };

  static fromAlteration = (alteration: number) => {
    return alteration <= 0 ? 'b'.repeat(alteration) : '#'.repeat(alteration);
  };

  constructor(accidental: string) {
    super();
    this.type = accidental;
    this.value = NAccidental.toAlteration(accidental);
  }
}

export class NPC extends TypeValue {
  constructor(letter: string, accidental: string) {
    super();

    const l = new NLetter(letter);
    const acc = new NAccidental(accidental);

    const offset = l.index;
    const semitonesAltered = offset + acc.value;
    const octavesAltered = Math.floor(semitonesAltered / 12);

    this.type = l.type + acc.type;
    this.value = either(
      (semitonesAltered - NOctave.toSemitones(octavesAltered) + 12) % 12,
      semitonesAltered % 12,
      ltz(octavesAltered),
    );
  }
}

export class NMidi {
  value: number;

  static toFrequency = (midi: number, tuning = A_440) => 2 ** div(sub(midi, A4_KEY), 12) * tuning;
  static toOctaves = (midi: number) => Math.floor(midi / 12) - 1;

  constructor(octave: number, chroma: number) {
    this.value = NOctave.toSemitones(octave) + chroma;
  }
}

export class NFrequency {
  value: number;

  static toMidi = (f: number, tuning = A_440) => Math.ceil(12 * Math.log2(f / tuning) + A4_KEY);

  constructor(midi: number, tuning = A_440) {
    this.value = 2 ** div(sub(midi, A4_KEY), 12) * tuning;
  }
}

export class NName {
  value: string;

  constructor(pc: string, octave: number) {
    this.value = pc + octave;
  }
}

export const note = (src: string, tuning = A_440) => {
  const { Tletter, Taccidental, Toct, Trest } = {
    Tletter: '',
    Taccidental: '',
    Toct: '',
    Trest: '',
    ...tokenize(src, REGEX),
  };

  if (Trest || !Tletter) {
    return { valid: false };
  }

  const letter = new NLetter(Tletter);
  const accidental = new NAccidental(Taccidental);
  const { value: octave } = new NOctave(Toct);
  const pc = new NPC(letter.type, accidental.type);
  const { value: midi } = new NMidi(octave, pc.value);
  const { value: frequency } = new NFrequency(midi, tuning);
  const { value: name } = new NName(pc.type, octave);

  return {
    name,
    octave,
    midi,
    frequency,
    letter,
    accidental,
    pc,
    valid: true,
  };
};

export function Note({ name, midi, frequency, sharps = true, tuning = 440 }: NoteInit = {}): NoteProps {
  const { isName, isMidi, isFrequency } = Validators;

  const { toIndex, toStep } = NLetter;
  const { toAlteration } = NAccidental;
  const { toSemitones } = NOctave;
  const { toFrequency, toOctaves } = NMidi;
  const { toMidi } = NFrequency;

  function fromName(note: NoteName, sharps = true, tuning = A_440, strict = true): NoteProps {
    const { Tletter, Taccidental, Toct, Trest } = {
      Tletter: '',
      Taccidental: '',
      Toct: '',
      Trest: '',
      ...tokenize(note, REGEX),
    };

    if (Trest || !Tletter) {
      return NoteError('InvalidConstructor', note, EmptyNote);
    }

    const letter = capitalize(Tletter) as NoteLetter;
    const step = toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = toAlteration(accidental) as NoteAlteration;

    // Offset (number of keys) from first letter - C
    const offset = toIndex(letter);

    // Note position is calculated as: letter offset from the start + in place alteration
    const semitonesAltered = offset + alteration;

    // Because of the alteration, note can slip into the previous/next octave
    const octavesAltered = Math.floor(semitonesAltered / 12);

    const octave = (NOctave.parse(Toct) + (strict ? octavesAltered : 0)) as NoteOctave;

    const pc: NotePC = `${letter}${accidental}`;

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - toSemitones(octavesAltered) + 12) % 12,
      semitonesAltered % 12,
      ltz(octavesAltered),
    ) as NoteChroma;

    const midi = (toSemitones(octave) + chroma) as NoteMidi;

    const frequency = toFrequency(midi, tuning) as NoteFreq;

    const name = `${pc}${octave}` as NoteName;

    const valid = true;

    return {
      name,
      octave,
      frequency,
      midi,
      pc,
      chroma,
      letter,
      step,
      accidental,
      alteration,
      valid,
    };
  }

  function fromMidi(midi: NoteMidi, useSharps = true): NoteProps {
    const octave = toOctaves(midi) as NoteOctave;

    const chroma = (midi % 12) as NoteChroma;
    const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

    const name = `${pc}${octave}` as NoteName;

    return fromName(name);
  }

  function fromFrequency(frequency: NoteFreq, useSharps = true, tuning = A_440): NoteProps {
    const midi = toMidi(frequency, tuning);
    return fromMidi(midi, useSharps);
  }

  if (isName(name)) return fromName(name, sharps, tuning);
  if (isMidi(midi)) return fromMidi(midi, sharps) as NoteProps;
  if (isFrequency(frequency)) return fromFrequency(frequency, sharps, tuning) as NoteProps;

  return NoteError('InvalidConstructor', { name, midi, frequency }, EmptyNote);
}
