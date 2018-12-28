import { midi } from './properties';
import { NAME } from './factories/name';


  /* Transpose @note by number of @semitones */
  export const bySemitones = (...args) => {
    if(args.length === 1)
      return note => bySemitones(note, args[0]);

    const [note, semitones] = args;
    return NAME.fromMidi(midi(note) + semitones);
  }


  /* Transpose @note by number of @tones */
  export const byTones = (...args) => {
    if(args.length === 1)
      return note => byTones(note, args[0]);

    const [note, tones] = args;
    return bySemitones(note, 2 * tones);
  }


  /* Transpose @note by number of @octaves */
  export const byOctaves = (...args) => {
    if(args.length === 1)
      return note => byOctaves(note, args[0]);

    const [note, octaves] = args;
    return bySemitones(note, 12 * octaves);
  }

  
  /* Parse units used for transpose */
  export const parseAmount = (amount) => {
    const OCTAVE_REGEX = /^(octaves|octave|oct|o)?$/;
    const STEPS_REGEX = /^(steps|step|s)?$/;
    const SEMI_REGEX = /^(halfsteps|halves|half|semi|h)$/;

    if (amount.length === 0) return 1;
    if (OCTAVE_REGEX.test(amount)) return 12;
    if (STEPS_REGEX.test(amount)) return 6;
    if (SEMI_REGEX.test(amount)) return 1;

    return 0;

  };

  
  /* Transpose note @note by ammount @by */
  export const transpose = (...args) => {
    if(args.length === 1) 
      return note => transpose(note, args[0]);
    
    const [note, by] = args;
    const unitAmount = by.split(' ');
    const amount = Number.parseInt(unitAmount[0]);
    const unitValue = parseAmount(unitAmount[1]);
    return bySemitones(note, amount * unitValue);
  };

  
  /* Get next note by incrementing MIDI */
  export const next = note => NAME.fromMidi(midi(note) + 1);

  
  /* Get prev note by decrementing MIDI */
  export const prev = note => NAME.fromMidi(midi(note) - 1);

  
  /* Get note @n steps ahead */
  export const nextBy = (...args) => {

    if(args.length === 1) 
      return note => nextBy(note, args[0]);

    const [note, amount] = args;
    const newMidi = midi(note) + amount;

    return NAME.fromMidi(newMidi);
  };

  
  /* Get note @n steps behind */
  export const prevBy = (...args) => nextBy(...args);
