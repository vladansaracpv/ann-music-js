import { compose, curry, either, glue } from '../helpers';
import { Theory } from './theory';
import { Validator } from './validator';
import { FREQUENCY, MIDI, NAME } from './factory';

export class Properties {

  /**
   *  Create note object by parsing note string
   *
   *  @function
   *
   *  @param {string} note        Note string
   *
   *  @return {object}            Note object
   *
   */
  static props = (name): any => {

    const tokens = Theory.parse(name);
    if (!tokens) return Theory.EMPTY_NOTE;

    const { letter, accidental, octave, rest } = tokens;
    if (letter === '' || rest !== '') return Theory.EMPTY_NOTE;

    const note = Theory.EMPTY_NOTE;
    note.letter = letter.toUpperCase();
    note.accidental = accidental;
    note.octave = octave ? Number.parseInt(octave) : 4;
    note.pc = glue(note.letter, note.accidental);
    note.name = glue(note.pc, note.octave);
    note.step = Theory.LETTERS.indexOf(letter);
    note.alteration = note.accidental.indexOf('b') > -1 ? -accidental.length : accidental.length;
    note.chroma = (Theory.SEMI[note.step] + note.alteration + 120) % 12;
    note.midi = Theory.SEMI[note.step] + note.alteration + 12 * (note.octave + 1);
    note.frequency = note.midi ? FREQUENCY.fromMidi(note.midi) : undefined;

    return note;
  };

  /**
   *  Create note object by parsing note string
   *
   *  @function
   *
   *  @param {string} property    Note property
   *  @param {string} note        Note string
   *
   *  @return {any}               Note property
   *
   */
  static property = curry((name, note) => Properties.props(note)[name]);

  /**
   *  Return note in simplified notation if possible.
   *
   *  @function
   *
   *  @param {string}  note               Note frequency
   *  @param {boolean} [sameAcc = true]   Should the note be created with sharps
   *
   *  @return {any}                       Note object
   *
   */
  static simplify = (note: string, sameAcc = true): any => {

    const ifMidi = Validator.isMidi(Properties.property('midi', note));

    const nameFromMidi = compose(NAME.fromMidi, Properties.property('midi'))(note);
    const nameFromPc = compose(Properties.property('pc'), NAME.fromMidi, Properties.property('chroma'))(note);


    return either(nameFromMidi, nameFromPc, ifMidi);

  };

  /**
   *  Return enharmonic note of given note
   *
   *  @function
   *
   *  @param {string}  note               Note string
   *
   *  @return {string}                    Note object
   *
   */
  static enharmonic = (note: string): string => Properties.simplify(note, false);

}

  // Getters for note properties
export const name = note => Properties.props(note).name;
export const letter = note => Properties.props(note).letter;
export const accidental = note => Properties.props(note).accidental;
export const octave = note => Properties.props(note).octave;
export const pc = note => Properties.props(note).pc;
export const step = note => Properties.props(note).step;
export const alteration = note => Properties.props(note).alteration;
export const chroma = note => Properties.props(note).chroma;
export const midi = note => Properties.props(note).midi;
export const frequency = note => Properties.props(note).frequency;
