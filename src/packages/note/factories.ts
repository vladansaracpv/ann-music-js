import { tokenize, capitalize, substitute } from '@base/strings';
import { lt } from '@base/relations';
import { either } from '@base/boolean';
import { and2 as both } from '@base/logical';
import { CustomError } from '@base/error';
import { compose2 } from '@base/functional';
import { OCTAVE_RANGE, NOTE_REGEX, FLATS, SHARPS, A_440 } from './theory';
import { Validators, Letter, Accidental, Octave, Midi, Frequency } from './properties';
const NoteError = CustomError('Note');

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE FACTORIES                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function noteFromName(note: NoteName): NoteProps {
  const tokens = tokenize(note, NOTE_REGEX);

  if (!tokens || tokens['Trest']) return NoteError('InvalidName', note);

  const { Tletter, Taccidental, Toct } = tokens;

  const letter = capitalize(Tletter) as NoteLetter;
  const step = Letter.stepOf(letter) as NoteStep;

  const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

  /** Offset (number of keys) from first letter - C **/
  const offset = Letter.indexOf(letter);

  /** Note position is calculated as: offset from the start + in place alteration **/
  const altered = offset + alteration;

  /** Because of the alteration, note can slip into the previous/next octave **/
  const alteredOctave = Math.floor(altered / OCTAVE_RANGE);

  const octave = Octave.parse(Toct) as NoteOctave;
  const name = capitalize(note) as NoteName;

  const pc = (letter + accidental) as NotePC;

  /**
   *  @example
   *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
   *  altered == -1
   *  alteredOct == -1
   */
  const chroma = either(
    (altered - Octave.toSemitones(alteredOctave)) % OCTAVE_RANGE,
    altered % OCTAVE_RANGE,
    lt(alteredOctave, 0),
  ) as NoteChroma;

  const midi = (Octave.toSemitones(octave) + chroma) as NoteMidi;
  const frequency = Midi.toFrequency(midi) as NoteFreq;

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
  });
}

export function noteFromMidi(midi: NoteMidi, useSharps = true): NoteProps {
  if (!Validators.isNoteMidi(midi)) return NoteError('InvalidMidi', midi);

  const frequency = Midi.toFrequency(midi) as NoteFreq;
  const octave = (Midi.toOctaves(midi) - 1) as NoteOctave;

  const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

  const name: NoteName = pc + octave;

  const tokens = tokenize(name, NOTE_REGEX);

  const letter = tokens['Tletter'] as NoteLetter;
  const step = Letter.stepOf(letter) as NoteStep;

  const accidental = substitute(tokens['Taccidental'], /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

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
  });
}

export function noteFromFreq(freq: NoteFreq, tuning = A_440): NoteProps {
  if (!Validators.isNoteFreq(freq)) {
    return undefined;
  }

  return compose2(noteFromMidi, Frequency.toMidi)(freq, tuning);
}

export function Note(note: NoteInitProp): NoteProps {
  if (!note) return NoteError('EmptyConstructor', undefined);

  const { name, midi, frequency } = note;

  const { isNoteName, isNoteMidi, isNoteChroma, isNoteFreq } = Validators;

  if (name && isNoteName(name)) return noteFromName(name);

  if (midi && isNoteMidi(midi)) return noteFromMidi(midi);

  if (frequency && isNoteFreq(frequency)) return noteFromFreq(frequency);

  return NoteError('InvalidConstructor', JSON.stringify(note));
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                NOTE - FUNCTIONS                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function simplify(name: NoteName, useSameAccidental = true): NoteName {
  const note = noteFromName(name);

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, useSameAccidental) || both(!isSharp, !useSameAccidental);

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

export function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}
