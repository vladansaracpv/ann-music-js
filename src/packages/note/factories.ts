import * as Theory from './theory';
import { CustomError } from '@base/error';
import { chord } from '@packages/chord';
import { scale } from '@packages/scale';
import {
  isNegative,
  inSegment,
  lt,
  leq,
  eq,
  neq,
  gt,
  geq,
  cmp,
  tokenize,
  capitalize,
  substitute,
  either,
  inc,
  dec,
  and2 as both,
  isInteger,
  isNumber,
} from '@base/index';

const NoteError = CustomError('Note');

const EmptyNote: NoteProps = {
  name: undefined,
  letter: undefined,
  step: undefined,
  octave: undefined,
  accidental: undefined,
  alteration: undefined,
  pc: undefined,
  chroma: undefined,
  midi: undefined,
  frequency: undefined,
  color: undefined,
  duration: undefined,
  valid: false,
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - HELPER FUNCTIONS             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
const Midi = {
  toFrequency: (key: NoteMidi, tuning = Theory.A_440): NoteFreq =>
    tuning * 2 ** ((key - Theory.MIDDLE_KEY) / Theory.OCTAVE_RANGE),
  toOctaves: (key: NoteMidi) => Math.floor(key / Theory.OCTAVE_RANGE),
};

const Frequency = {
  toMidi: (freq: NoteFreq, tuning = Theory.A_440) =>
    Math.ceil(Theory.OCTAVE_RANGE * Math.log2(freq / tuning) + Theory.MIDDLE_KEY),
};

const Accidental = {
  toAlteration: (accidental: NoteAccidental): number => accidental.length * (accidental[0] === 'b' ? -1 : 1),
};

const Letter = {
  toStep: (letter: NoteLetter): number => (letter.charCodeAt(0) + 3) % 7,
  toIndex: (letter: NoteLetter) => Theory.SHARPS.indexOf(letter),
};

const Octave = {
  parse: (octave?: string): NoteOctave =>
    either(Number.parseInt(octave), Theory.STANDARD_OCTAVE, Number.isInteger(Number.parseInt(octave))),
  toSemitones: (octave: number) => Theory.OCTAVE_RANGE * inc(octave),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
const Validators = {
  isName: (name: string): boolean => Theory.NOTE_REGEX.test(name) === true,
  isMidi: (midi: number): boolean => both(isInteger(midi), inSegment(0, 140, midi)),
  isChroma: (chroma: number): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
  isFrequency: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
  isKey: (key: string): boolean => Theory.KEYS.includes(key),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE FACTORIES                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function createNote(props: InitProps, methods?: InitMethods): NoteProps {
  const { name, midi, frequency, duration } = props;

  function createNoteWithName(note: NoteName, nduration?: NoteDuration, methods?: InitMethods): NoteProps {
    // Example: A#4
    const { comparison, transposition, distance, extension } = { ...methods };

    if (!Validators.isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { Tletter, Taccidental, Toct, Tduration, Trest } = tokenize(note, Theory.NOTE_REGEX);

    if (Trest) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const letter = capitalize(Tletter) as NoteLetter; // A
    const step = Letter.toStep(letter) as NoteStep; // 5

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration; // +1

    /** Offset (number of keys) from first letter - C **/
    const offset = Letter.toIndex(letter); // 10

    /** Note position is calculated as: letter offset from the start + in place alteration **/
    const semitonesAltered = offset + alteration; // 11

    /** Because of the alteration, note can slip into the previous/next octave **/
    const octavesAltered = Math.floor(semitonesAltered / Theory.OCTAVE_RANGE); // 0
    const octave = Octave.parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - Octave.toSemitones(octavesAltered) + 12) % Theory.OCTAVE_RANGE,
      semitonesAltered % Theory.OCTAVE_RANGE,
      isNegative(octavesAltered),
    ) as NoteChroma; // 10

    const midi = (Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
    const frequency = Midi.toFrequency(midi) as NoteFreq; // 466.164

    const name = (pc + octave) as NoteName; // A#4

    const color = either('white', 'black', Theory.WHITE_KEYS.includes(chroma)) as NoteColor; // 'black'
    const durationFromParam = nduration ? nduration : 0;
    const durationFromToken = Tduration ? +Tduration.split('/')[1] : undefined;
    const duration = durationFromParam || durationFromToken;

    // const compareMethods = comparison ? setCompareMethods(midi) : {};
    const compareMethods = comparison ? withComparison : {};

    const transposeMethods = transposition ? withTranspose : {};

    const extendMethods = extension ? withExtension : {};

    const distanceMethods = distance ? withDistance : {};

    const valid = true;

    return Object.freeze({
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
      color,
      duration,
      valid,
      ...compareMethods,
      ...transposeMethods,
      ...extendMethods,
      ...distanceMethods,
    });
  }

  function createNoteWithMidi(
    midi: NoteMidi,
    useSharps = true,
    nduration?: NoteDuration,
    methods?: InitMethods,
  ): NoteProps {
    if (!Validators.isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);

    const frequency = Midi.toFrequency(midi) as NoteFreq;
    const octave = dec(Midi.toOctaves(midi)) as NoteOctave;

    const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
    const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental, Tduration } = tokenize(name, Theory.NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter;
    const step = Letter.toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

    const color = either('white', 'black', Theory.WHITE_KEYS.includes(chroma)) as NoteColor;

    const durationFromParam = nduration ? nduration : 0;
    const durationFromToken = Tduration ? +Tduration.split('/')[1] : undefined;
    const duration = durationFromParam || durationFromToken;

    const valid = true;

    return Object.freeze({
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
      color,
      duration,
      valid,
    });
  }

  function createNoteWithFreq(
    frequency: NoteFreq,
    tuning = Theory.A_440,
    nduration?: NoteDuration,
    methods?: InitMethods,
  ): NoteProps {
    if (!Validators.isFrequency(frequency)) return NoteError('InvalidConstructor', { frequency }, EmptyNote);

    const midi = Frequency.toMidi(frequency, tuning);
    return createNoteWithMidi(midi, true, nduration);
  }

  if (name && Validators.isName(name)) return createNoteWithName(name, duration, methods);

  if (midi && Validators.isMidi(midi)) return createNoteWithMidi(midi, true, duration);

  if (frequency && Validators.isFrequency(frequency)) return createNoteWithFreq(frequency, 440, duration);

  return EmptyNote;
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

function property(prop: string) {
  return function(name: NoteName) {
    const note = createNote({ name });
    return note && note[prop];
  };
}

function simplify(name: NoteName, keepAccidental = true): NoteName {
  const note = createNote({ name });

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, keepAccidental) || both(!isSharp, !keepAccidental);

  const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps);

  return pc + octave;
}

function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

function eitherOrder(fn: (x: number, y: number) => boolean, a: NoteProps, b?: NoteProps) {
  return b ? fn(a.midi, b.midi) : fn(this.midi, a.midi);
}

const withChordExpansion = {
  toChord: function(type: string, tonic?: NoteName) {
    const name = this.name ? this.name : '';
    return tonic ? chord([tonic, type]) : chord([name, type]);
  },
};

const withScaleExpansion = {
  toScale: function(type: string, tonic?: NoteName) {
    const name = this.name ? this.name : '';
    return tonic ? scale([tonic, type]) : scale([name, type]);
  },
};

const withExtension = {
  ...withChordExpansion,
  ...withScaleExpansion,
};

const withTranspose = {
  transposeBy: function(n: number, b?: NoteProps) {
    return b ? createNote({ midi: b.midi + n }) : createNote({ midi: this.midi + n });
  },
};

const withComparison = {
  lt: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, lt, a, b);
  },
  leq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, leq, a, b);
  },
  eq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, eq, a, b);
  },
  neq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, neq, a, b);
  },
  gt: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, gt, a, b);
  },
  geq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, geq, a, b);
  },
  cmp: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, cmp, a, b);
  },
};

const withDistance = {
  distanceTo: function(a: NoteProps, b?: NoteProps) {
    return b ? b.midi - a.midi : a.midi - this.midi;
  },
};

const setCompareMethods = (midi?: NoteMidi) => {
  if (midi)
    return {
      lessThan: (b: NoteMidi) => lt(midi, b),
      lessOrEqual: (b: NoteMidi) => leq(midi, b),
      equal: (b: NoteMidi) => eq(midi, b),
      notEqual: (b: NoteMidi) => neq(midi, b),
      greaterThan: (b: NoteMidi) => gt(midi, b),
      greaterOrEqual: (b: NoteMidi) => geq(midi, b),
      compare: (b: NoteMidi) => cmp(midi, b),
    };
  return { lt, leq, eq, neq, gt, geq, cmp };
};

export const Note = {
  Validators: Validators,
  from: createNote,
  property,
  simplify,
  enharmonic,
  Midi,
  Frequency,
  Accidental,
  Letter,
  Octave,
  Theory,
  setCompareMethods,
};
