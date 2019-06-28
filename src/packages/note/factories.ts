import { tokenize, capitalize, substitute } from '@base/strings';
import { isNegative } from '@base/relations';
import { either } from '@base/boolean';
import { CustomError } from '@base/error';
import { compose } from '@base/functional';
import { OCTAVE_RANGE, NOTE_REGEX, FLATS, SHARPS, A_440, WHITE_KEYS } from './theory';
import { Validators, Letter, Accidental, Octave, Midi, Frequency } from './properties';

const NoteError = CustomError('Note');

const NoNote: NoNote = { valid: false, name: '' };

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE FACTORIES                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function createNoteWithName(note: NoteName): NoteProps | NoNote {
  if (!Validators.isNoteName(note)) return NoNote;
  const tokens = tokenize(note, NOTE_REGEX);

  const { Tletter, Taccidental, Toct } = tokens;

  const letter = capitalize(Tletter) as NoteLetter;
  const step = Letter.toStep(letter) as NoteStep;

  const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

  /** Offset (number of keys) from first letter - C **/
  const offset = Letter.toIndex(letter);

  /** Note position is calculated as: offset from the start + in place alteration **/
  const semitonesAltered = offset + alteration;

  /** Because of the alteration, note can slip into the previous/next octave **/
  const octavesAltered = Math.floor(semitonesAltered / OCTAVE_RANGE);

  const octave = Octave.parse(Toct) as NoteOctave;

  const pc = (letter + accidental) as NotePC;

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
  ) as NoteChroma;

  const midi = (Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi;
  const frequency = Midi.toFrequency(midi) as NoteFreq;

  const name = (pc + octave) as NoteName;

  const color = WHITE_KEYS.includes(chroma) ? 'white' : 'black';
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
    valid,
  });
}

export function createNoteWithMidi(midi: NoteMidi, useSharps = true): NoteProps | NoNote {
  if (!Validators.isNoteMidi(midi)) return NoNote;

  const frequency = Midi.toFrequency(midi) as NoteFreq;
  const octave = (Midi.toOctaves(midi) - 1) as NoteOctave;

  const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

  const name: NoteName = pc + octave;

  const tokens = tokenize(name, NOTE_REGEX);

  const letter = tokens['Tletter'] as NoteLetter;
  const step = Letter.toStep(letter) as NoteStep;

  const accidental = substitute(tokens['Taccidental'], /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

  const color = WHITE_KEYS.includes(chroma) ? 'white' : 'black';

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
    valid,
  });
}

export function createNoteWithFreq(freq: NoteFreq, tuning = A_440): NoteProps | NoNote {
  if (!Validators.isNoteFreq(freq)) return NoNote;

  return compose(
    createNoteWithMidi,
    Frequency.toMidi,
  )(freq, tuning);
}

export const NoteFactory = {
  fromName: createNoteWithName,
  fromMidi: createNoteWithMidi,
  fromFreq: createNoteWithFreq,
};
