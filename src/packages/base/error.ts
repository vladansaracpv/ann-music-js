import { Logger } from '@packages/base/logger';

/** Error handling */
export enum ErrorCode {
  // Note
  InvalidConstructor = 'Cannot create Note from given values.',
  EmptyConstructor = 'Cannot create Note from nothing. Provide name | midi | frequency.',
  InvalidNoteProperty = 'Note property provided is not valid.',
  InvalidName = 'Note.name provided is not a valid shape: <letter><accidental?><octave?>.',
  InvalidMidi = 'Note.midi provided is not valid. Must hold: 0 < midi < 128.',
  InvalidChroma = 'Chroma number provided is not valid. Must hold: 0 <= chroma < 12.',
  InvalidFrequency = 'Frequency provided is not valid. Must be positive number > 0.',

  // Interval
  InvalidIvlConstructor = 'Cannot create Interval from given initial values.',
  InvalidIvlName = 'Interval.name provided is not a valid shape: <number><quality> | <quality><number>.',

  // Duration
  InvalidSplitValue = 'Duration.parts is not a valid value. Must be power of 2.',
  InvalidDuration = 'Duration value is not valid.',
}

export const CustomError = (file: string) => (code: string, value, returnValue) => {
  const log = new Logger(file);
  log.error('Error: ' + ErrorCode[code] + ' Got: ' + JSON.stringify(value));
  return returnValue;
};
