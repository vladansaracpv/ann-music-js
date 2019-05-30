/** Error handling */
export enum ErrorCode {
  // Note
  InvalidConstructor = "Couldn't create Note from given initial values. Got:",
  EmptyConstructor = "Couldn't create Note from nothing. Provide name | midi | frequency. Got:",
  InvalidNoteProperty = 'Note property provided is not valid. Got:',
  InvalidName = 'Note.name provided is not a valid shape: <letter><accidental?><octave?>. Got:',
  InvalidMidi = 'Note.midi provided is not valid. Must hold: 0 < midi < 128. Got:',
  InvalidChroma = 'Chroma number provided is not valid. Must hold: 0 <= chroma < 12. Got:',
  // Interval
  InvalidIvlConstructor = "Couldn't create Interval from given initial values. Got:",
  InvalidIvlName = 'Interval.name provided is not a valid shape: <number><quality> | <quality><number>. Got:',
  // Duration
  InvalidSplitValue = 'Duration.parts is not a valid value. Must be power of 2. Got:',
  InvalidDuration = 'Duration value is not valid. Got:',
}

export const CustomError = (code: ErrorCode, value) => {
  return `Error: ${code} ${value}`;
  // console.error(`Error: ${code} ${value}`);
  // return null;
};

// import { curry } from '../helpers/index';

// export class FactoryError {

//   static MISSING_ARGS = curry((...args) => {
//     const dict = FactoryError.errorDict(args);
//     console.log(`Couldn't create NOTE.${dict.forProp} just from NOTE.${dict.fromProp}: '${dict.withValue}'. Try with ${dict.need} included.`);
//     return undefined;
//   });

//   static NO_FACTORY = curry((...args) => {
//     const dict = FactoryError.errorDict(args);
//     console.log(`Couldn't create NOTE.${dict.forProp} from NOTE.${dict.fromProp}: '${dict.withValue}'`);
//     return undefined;
//   });

//   static errorDict = (args) => {
//     return { forProp: args[0], fromProp: args[1], withValue: args[2], need: args.length === 4 ? args[3] : '' };
//   };
// }
