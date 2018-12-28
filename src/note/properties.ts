import { curry, glue } from '../helpers';
import { Theory as NOTE } from './theory';
import { FREQUENCY } from './factories/frequency';
import { NAME } from './factories/name';

export class Properties {

  /**
   *  Create note object by parsing note string
   *
   *  @function
   *
   *  @param  {string} note   Note string
   *
   *  @return {object}        Note object
   *
   */
  static props = (noteName): any => {

    const tokens = NOTE.parse(noteName);
    if (!tokens) return NOTE.EMPTY_NOTE;

    const { letter, accidental, octave } = tokens;


    /**
     *  Pitch Class (pc) is made from 
     *  - @letter (C, D, E.., B)
     *  - @accidental ('#', 'bb', '')
     *  
     *  Example: C#, Gb, F##
     */
    const pc = glue(letter, accidental);


    /**
     *  Note name is pitch class with octave
     *  
     *  Example: C#4, Gb3, F##5
     */
    const name = glue(pc, octave);


    /**
     *  Note step is index of it's letter, starting from 0 (C)
     *  
     *  Example: C(0), F(3)...
     */
    const step = NOTE.LETTERS.indexOf(letter);


    /**
     *  Note alteration is integer value of accidental value
     *  - # = +1
     *  - b = -1
     * 
     *  Example: ## = 2, bb = -2
     */
    const accl = accidental.length;
    const alteration = accidental.indexOf('b') ? accl : -accl;


    /**
     *  Note chroma value is index of it's PC starting from 0 (C),
     * 
     *  Example: C#: 1, F#/Gb: 6
     */
    const chroma = Math.abs(NOTE.WHITES[step] + alteration) % 12;


    /**
     *  Note midi value is it's unique index used in midi devices
     * 
     *  Example: C4: 60, C-1: 0, D#2: 39
     */
    const midi = NOTE.WHITES[step] + alteration + 12 * (octave + 1);


    /**
     *  Note frequency
     */
    const frequency = midi ? FREQUENCY.fromMidi(midi) : undefined;

    return {
      ...NOTE.EMPTY_NOTE,
      name,
      letter,
      step,
      accidental,
      alteration,
      octave,
      pc,
      chroma,
      midi,
      frequency
    };
  };

  
  /**
   *  Create note object by parsing note string
   *
   *  @function
   *
   *  @param  {string} property   Note property
   *  @param  {string} note       Note string
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
  static simplify = (note: string, withSameAccidentals = true): any => {
    /** Try to get midi value */
    const midi = Properties.property('midi', note);
    
    /** Should the same accidentals be used */
    const alteration = Properties.property('alteration', note);
    const hasSharps = alteration > 0;
    const useSharps = withSameAccidentals ? hasSharps : !hasSharps;

    return NAME.fromMidi(midi, useSharps);
  };

  /**
   *  Return enharmonic note of given note
   *
   *  @function
   *
   *  @param  {string}  note       Note string
   *
   *  @return {string}            Note object
   *
   */
  static enharmonic = (note: string): string => Properties.simplify(note, false);
}

// Getters for note properties
const props = Properties.props;
export const name =       note => props(note).name;
export const letter =     note => props(note).letter;
export const step =       note => props(note).step;
export const accidental = note => props(note).accidental;
export const alteration = note => props(note).alteration;
export const octave =     note => props(note).octave;
export const pc =         note => props(note).pc;
export const chroma =     note => props(note).chroma;
export const midi =       note => props(note).midi;
export const frequency =  note => props(note).frequency;
