import { Logger } from '../base/logger';

/** Error handling */
export enum ErrorCode {
  // Note
  InvalidConstructor = 'Cannot create Note from given initial values. Got:',
  EmptyConstructor = 'Cannot create Note from nothing. Provide name | midi | frequency. Got:',
  InvalidNoteProperty = 'Note property provided is not valid. Got:',
  InvalidName = 'Note.name provided is not a valid shape: <letter><accidental?><octave?>. Got:',
  InvalidMidi = 'Note.midi provided is not valid. Must hold: 0 < midi < 128. Got:',
  InvalidChroma = 'Chroma number provided is not valid. Must hold: 0 <= chroma < 12. Got:',
  InvalidFrequency = 'Frequency provided is not valid. Must be positive number > 0. Got:',

  // Interval
  InvalidIvlConstructor = 'Cannot create Interval from given initial values. Got:',
  InvalidIvlName = 'Interval.name provided is not a valid shape: <number><quality> | <quality><number>. Got:',

  // Duration
  InvalidSplitValue = 'Duration.parts is not a valid value. Must be power of 2. Got:',
  InvalidDuration = 'Duration value is not valid. Got:',
}

export const CustomError = (file: string) => (code: string, value) => {
  const log = new Logger(file);
  log.error(`Error: ${ErrorCode[code]} ${value}`);
  return null;
};
