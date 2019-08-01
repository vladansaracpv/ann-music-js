/* eslint-disable @typescript-eslint/no-use-before-define */
import { tokenize, capitalize, substitute } from '@base/strings';
import { isNegative } from '@base/relations';
import { either } from '@base/boolean';
import { CustomError } from '@base/error';
import { OCTAVE_RANGE, NOTE_REGEX, FLATS, SHARPS, A_440, WHITE_KEYS } from './theory';
import {
  Letter,
  Accidental,
  Octave,
  Midi,
  Frequency,
  NoteValidator,
  NoteRelations,
  withDistance,
  withRelations,
} from './mixins';
import { and2 as both } from '@base/logical';
import { isObject, isFunction, isNumber } from '@base/types';

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
  valid: false,
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE FACTORIES                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

function createNoteWithName(note: NoteName, methods?: NoteMethodsConfig): NoteProps {
  // Example: A#4

  if (!NoteValidator.isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

  const { Tletter, Taccidental, Toct } = tokenize(note, NOTE_REGEX);

  const letter = capitalize(Tletter) as NoteLetter; // A
  const step = Letter.toStep(letter) as NoteStep; // 5

  const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration; // +1

  /** Offset (number of keys) from first letter - C **/
  const offset = Letter.toIndex(letter); // 10

  /** Note position is calculated as: letter offset from the start + in place alteration **/
  const semitonesAltered = offset + alteration; // 11

  /** Because of the alteration, note can slip into the previous/next octave **/
  const octavesAltered = Math.floor(semitonesAltered / OCTAVE_RANGE); // 0
  const octave = Octave.parse(Toct) as NoteOctave; // 4

  const pc = (letter + accidental) as NotePC; // A#

  /**
   *  @example
   *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
   *  altered == -1
   *  alteredOct == -1
   */
  const chroma = either(
    (semitonesAltered - Octave.toSemitones(octavesAltered) + 12) % OCTAVE_RANGE,
    semitonesAltered % OCTAVE_RANGE,
    isNegative(octavesAltered),
  ) as NoteChroma; // 10

  const midi = (Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
  const frequency = Midi.toFrequency(midi) as NoteFreq; // 466.164

  const name = (pc + octave) as NoteName; // A#4

  const color = either('white', 'black', WHITE_KEYS.includes(chroma)); // 'black'
  const valid = true;
  const { distanceTo } = withDistance;
  const { lt } = withRelations;
  // const op = methods.withRelations ? NoteRelations('midi', midi) : undefined;
  // const distanceTo = methods.withDistance ? withDistance.distanceTo : undefined;
  // const transposeBy = methods.withTransposition ? (n: number) => Note({ midi: midi + n, ...methods }) : undefined;

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
    valid,
    // op,
    lt,
    distanceTo,
    // transposeBy,
  });
}

function createNoteWithMidi(midi: NoteMidi, methods?: NoteMethodsConfig, useSharps = true): NoteProps {
  if (!NoteValidator.isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);

  const frequency = Midi.toFrequency(midi) as NoteFreq;
  const octave = (Midi.toOctaves(midi) - 1) as NoteOctave;

  const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

  const name = (pc + octave) as NoteName;

  const { Tletter, Taccidental } = tokenize(name, NOTE_REGEX);

  const letter = capitalize(Tletter) as NoteLetter;
  const step = Letter.toStep(letter) as NoteStep;

  const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

  const color = either('white', 'black', WHITE_KEYS.includes(chroma)) as NoteColor;

  const valid = true;
  // const op = methods.withRelations ? NoteRelations('midi', midi) : undefined;
  // const distanceTo = methods.withDistance ? withDistance.distanceTo : undefined;
  // const transposeBy = methods.withTransposition ? (n: number) => Note({ midi: midi + n, ...methods }) : undefined;

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
    valid,
    // op,
    // distanceTo,
    // transposeBy,
  });
}

function createNoteWithFreq(freq: NoteFreq, methods?: NoteMethodsConfig, tuning = A_440): NoteProps {
  if (!NoteValidator.isFrequency(freq)) return NoteError('InvalidConstructor', { frequency: freq }, EmptyNote);

  const midi = Frequency.toMidi(freq, tuning);
  return createNoteWithMidi(midi, methods);
}

export const Note = (props: InitProps): NoteProps => {
  const { name, midi, frequency } = props;

  if (name && NoteValidator.isName(name)) return createNoteWithName(name);
  if (midi && NoteValidator.isMidi(midi)) return createNoteWithMidi(midi);
  if (frequency && NoteValidator.isFrequency(frequency)) return createNoteWithFreq(frequency);
  return EmptyNote;
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

const property = (prop: string) => (name: NoteName) => {
  const note = Note({ name });
  return note && note[prop];
};

function simplify(name: NoteName, useSameAccidental = true): NoteName {
  const note = Note({ name });

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, useSameAccidental) || both(!isSharp, !useSameAccidental);

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

export const transpose = (a: NoteProps | number, b: number) => {
  if (isNumber(a)) return Note({ midi: a + b });
  return {
    ...a,
    ...Note({ midi: a.midi + b }),
  };
};

const { distanceTo } = withDistance;
export const NoteStatic = {
  simplify,
  enharmonic,
  name: property('name'),
  octave: property('octave'),
  letter: property('letter'),
  step: property('step'),
  accidental: property('accidental'),
  alteration: property('alteration'),
  pc: property('pc'),
  chroma: property('chroma'),
  midi: property('midi'),
  frequency: property('frequency'),
  color: property('color'),
  valid: property('valid'),
  op: NoteRelations('midi'),
  distanceTo,
  transpose,
};
