/** Error handling */
export enum ErrorCode {
  InvalidConstructor = "Couldn't create Note from given initial values. Provided:",
  EmptyConstructor = "Couldn't create Note from nothing. Provide name | midi | frequency. Provided:",
  InvalidNoteProperty = 'Note property provided is not valid. Provided:',
  InvalidName = 'Note.name provided is not a valid shape: <letter><accidental?><?octave>. Provided:',
  InvalidMidi = 'Note.midi provided is not valid. Must hold: 0 < midi < 128. Provided:',
  InvalidChroma = 'Chroma number provided is not valid. Must hold: 0 <= chroma < 12. Provided:',
}

export const CustomError = (code: ErrorCode, value) => {
  console.error(`Error: ${code} ${value}`);
  return null;
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
