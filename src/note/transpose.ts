import { midi } from './properties';
import { NAME } from './factories/name';

export class Transpose {

  /** Transpose @note by number of @semitones */
  static bySemitones = (...args) => {
    if(args.length === 1)
      return note => Transpose.bySemitones(note, args[0]);

    const [note, semitones] = args;
    return NAME.fromMidi(midi(note) + semitones);
  }


  /** Transpose @note by number of @tones */
  static byTones = (...args) => {
    if(args.length === 1)
      return note => Transpose.byTones(note, args[0]);

    const [note, tones] = args;
    return Transpose.bySemitones(note, 2 * tones);
  }


  /** Transpose @note by number of @octaves */
  static byOctaves = (...args) => {
    if(args.length === 1)
      return note => Transpose.byOctaves(note, args[0]);

    const [note, octaves] = args;
    return Transpose.bySemitones(note, 12 * octaves);
  }

  /** Parse units used for transpose */
  static parseAmount = (amount) => {
    const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
    const STEPS_REGEX = /^(steps|step|s)?$/;
    const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;

    if (amount.length === 0) return 1;
    if (OCTAVE_REGEX.test(amount)) return 12;
    if (STEPS_REGEX.test(amount)) return 6;
    if (SEMI_REGEX.test(amount)) return 1;

    return 0;

  };


  /** Transpose note @note by ammount @by */
  static transpose = (...args) => {
    if(args.length === 1) 
      return note => Transpose.transpose(note, args[0]);
    
    const [note, by] = args;
    const unitAmount = by.split(' ');
    const amount = Number.parseInt(unitAmount[0]);
    const unitValue = Transpose.parseAmount(unitAmount[1]);
    return Transpose.bySemitones(note, amount * unitValue);
  };


  /** Get next note by incrementing MIDI */
  static next = note => NAME.fromMidi(midi(note) + 1);


  /** Get prev note by decrementing MIDI */
  static prev = note => NAME.fromMidi(midi(note) - 1);


  /** Get note @n steps ahead */
  static nextBy = (...args) => {

    if(args.length === 1) 
      return note => Transpose.nextBy(note, args[0]);

    const [note, amount] = args;
    const newMidi = midi(note) + amount;

    return NAME.fromMidi(newMidi);
  };


  /** Get note @n steps behind */
  static prevBy = (...args) => Transpose.nextBy(...args);

}
