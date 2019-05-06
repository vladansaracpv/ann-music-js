// import { glue, either, charAtEq, len, pipe, curry, mod, dec, lt, tokenize } from '../helpers';
// import { WITH_SHARP_NOTES, WITH_FLAT_NOTES, LETTERS, OCTAVE_SIZE, NOTE_REGEX } from './theory';

// module Accidental {
//   // import { compose, curry } from '../../helpers';
//   // import { FactoryError as ERROR } from '../../error';
//   // import { isAccidental } from '../validator';
//   // import { WITH_SHARPS } from '../theory';

//   // const pcFromChroma = chroma => WITH_SHARPS[chroma];
//   // const pcFromMidi = midi => pcFromChroma(midi % 12);
//   // const midiFromFreq = (freq, tuning = 440.0) => Math.ceil(12 * Math.log2(freq / tuning) + 69);
//   // export class ACCIDENTAL {
//   //   static fromName = name => (name.length === 1 ? '' : name.substring(1));
//   //   static fromAccidental = acc => acc;
//   //   static fromPc = pc => ACCIDENTAL.fromName(pc);
//   //   static fromAlt = alt => (alt < 0 ? 'b'.repeat(-alt) : '#'.repeat(alt));
//   //   static fromChroma = chroma =>
//   //     compose(
//   //       ACCIDENTAL.fromName,
//   //       pcFromChroma
//   //     )(chroma);
//   //   static fromMidi = midi =>
//   //     compose(
//   //       ACCIDENTAL.fromPc,
//   //       pcFromMidi
//   //     )(midi);
//   //   static fromFreq = freq =>
//   //     compose(
//   //       ACCIDENTAL.fromMidi,
//   //       midiFromFreq
//   //     )(freq);
//   //   static fromLetter = letter =>
//   //     ERROR.NO_FACTORY('accidental', 'letter', letter);
//   //   static fromStep = step => ERROR.NO_FACTORY('accidental', 'step', step);
//   //   static fromOct = oct => ERROR.NO_FACTORY('accidental', 'octave', oct);
//   // }

//   // const FROM = {
//   //   accidental: ACCIDENTAL.fromAccidental,
//   //   name: ACCIDENTAL.fromName,
//   //   pc: ACCIDENTAL.fromPc,
//   //   alteration: ACCIDENTAL.fromAlt,
//   //   chroma: ACCIDENTAL.fromChroma,
//   //   midi: ACCIDENTAL.fromMidi,
//   //   frequency: ACCIDENTAL.fromFreq,
//   //   letter: ACCIDENTAL.fromLetter,
//   //   step: ACCIDENTAL.fromStep,
//   //   octave: ACCIDENTAL.fromOct
//   // };

//   // export const ACCIDENTAL_FACTORY = curry((prop, withValue) => {
//   //   const accidental = FROM[prop](withValue);
//   //   if (!accidental) return undefined;
//   //   return isAccidental(accidental) ? accidental : undefined;
//   // });

// }

// type NotePropertyType = {
//   readonly type: string,
//   readonly value: string | number
// }

// export abstract class NoteProperty {
//   private _type: string;
//   private _value: string | number;

//   public get type(): string {
//     return this._type;
//   }

//   /**
//    * Getter value
//    * @return {string}
//    */
//   public get value(): string | number {
//     return this._value;
//   }

//   /**
//    * Setter value
//    * @param {string} value
//    */
//   public set value(value: string | number) {
//     this._value = value;
//   }
// }

// /** INTERFACES */

// export interface NoteType {
//   name: string;
//   octave: number;
//   letter: string;
//   step: number;
//   accidental: string;
//   alteration: number;
//   pc: string;
//   chroma: number;
//   midi: number;
//   frequency: number;
// };

// export const KEYS = [
//   'name',
//   'letter',
//   'step',
//   'accidental',
//   'alteration',
//   'octave',
//   'pc',
//   'chroma',
//   'midi',
//   'frequency'
// ];

// export const EMPTY_NOTE = {
//   name: undefined,
//   letter: undefined,
//   step: undefined,
//   accidental: undefined,
//   alteration: undefined,
//   octave: undefined,
//   pc: undefined,
//   chroma: undefined,
//   midi: undefined,
//   frequency: undefined
// };

// export const NO_NOTE = Object.freeze(EMPTY_NOTE);

// /** HELPER FUNCTIONS */

// const mod12 = mod(12);
// const isNegative = (n: number) => lt(0, n);
// const tuneNote = (midi: number, tuning = 440): number => tuning * 2 ** ((midi - 69) / OCTAVE_SIZE);
// const quotient = (n: number) => (a: number) => Math.floor(a / n);
// const accidentalValue = (accidental: string): number => {
//   return either(
//     -len(accidental),
//     len(accidental),
//     charAtEq(0, 'b', accidental)
//   );
// }
// const octaveFromMidi = (midi: number): number => {
//   return pipe(
//     quotient(OCTAVE_SIZE),
//     dec
//   )(midi);
// }
// /** Helper parser fn */
// const capitalize = (l: string) => l.toUpperCase();
// const substitute = (str: string, regex: RegExp, char: string) => str.replace(regex, char);

// /** Tokenize note given by string */
// export const parseNote = (note: string) => {

//   const { letter, accidental, octave, rest } = tokenize(note, NOTE_REGEX);

//   if (!letter || rest) return null;

//   return {
//     letter: capitalize(letter),
//     accidental: substitute(accidental, /x/g, '##'),
//     octave: +octave | 4,
//   };

// };

// /** FACTORY FUNCTIONS */

// const fromName = (note: string): NoteType => {
//   const note_tokens = parseNote(note);
//   if (!note_tokens) return NO_NOTE;

//   const { letter, accidental } = note_tokens;

//   const name = note;

//   const alteration = accidentalValue(accidental);

//   const step = LETTERS.indexOf(letter);

//   const pc = glue(letter, accidental);

//   const offset = alteration + either(
//     WITH_FLAT_NOTES.indexOf(letter),
//     WITH_SHARP_NOTES.indexOf(letter),
//     alteration < 0
//   );
//   const altOctave = Math.floor(offset / OCTAVE_SIZE);

//   const octave = note_tokens.octave + altOctave;

//   const chroma = either(
//     mod12(offset - altOctave * OCTAVE_SIZE),
//     mod12(offset),
//     isNegative(altOctave)
//   )
//   const midi = (octave + 1) * OCTAVE_SIZE + chroma;
//   const frequency = tuneNote(midi);

//   const _note = {
//     ...EMPTY_NOTE,
//     name,
//     accidental,
//     alteration,
//     letter,
//     step,
//     pc,
//     chroma,
//     midi,
//     frequency,
//     octave,
//   };
//   return _note;

// }
// const fromChromaOctave = (chroma: number, octave: number, usingSharps = true): NoteType => {
//   const pc = either(
//     WITH_SHARP_NOTES[chroma],
//     WITH_FLAT_NOTES[chroma],
//     usingSharps
//   );
//   const name = glue(pc, octave);
//   return NoteStatic.fromName(name);
// }
// const fromMidi = (midi: number, usingSharps = true): NoteType => {
//   const octave = octaveFromMidi(midi);
//   const chroma = midi - (octave + 1) * OCTAVE_SIZE;
//   return NoteStatic.fromChromaOctave(chroma, octave, usingSharps);
// }
// const fromFrequency = (freq: number, usingSharps = true, tuning = 440): NoteType => {
//   const midi = Math.ceil(OCTAVE_SIZE * Math.log2(freq / tuning) + 69);
//   return NoteStatic.fromMidi(midi, usingSharps);
// }
// const fromPartial = (props: Partial<NoteType>, usingSharps = true): NoteType => {
//   const { name, letter, step, accidental, alteration, octave, pc, chroma, midi, frequency } = props;
//   if (name) return NoteStatic.fromName(name);
//   if (midi) return NoteStatic.fromMidi(midi, usingSharps);
//   if (frequency) return NoteStatic.fromFrequency(frequency, usingSharps);
//   if (octave && chroma) return NoteStatic.fromChromaOctave(chroma, octave, usingSharps);
//   return NO_NOTE;
// }

// /** NOTE STATIC METHODS */

// const cache = {} as { [key: string]: NoteType };
// const property = curry((prop: string, name: string) => NoteStatic.fromName(name)[prop]);
// const properties = (props: Partial<NoteType>): NoteType => {
//   if (cache[props.name]) return cache[props.name];
//   const note: NoteType = NoteStatic.fromPartial(props);
//   return cache[note.name] || (cache[note.name] = NoteStatic.fromPartial(props));
// };
// const simplify = (name: string, sameSign = true): string => {

//   const { chroma, alteration, octave } = NoteStatic.fromName(name);

//   const isSharp = alteration >= 0;

//   const pc = either(
//     either(WITH_SHARP_NOTES[chroma], WITH_FLAT_NOTES[chroma], sameSign),
//     either(WITH_FLAT_NOTES[chroma], WITH_SHARP_NOTES[chroma], sameSign),
//     isSharp
//   );

//   return glue(pc, octave);

// };
// const enharmonic = (name: string): string => simplify(name, false);

// export const NoteStatic = {
//   fromName,
//   fromMidi,
//   fromChromaOctave,
//   fromFrequency,
//   fromPartial,
//   create: properties,
//   simplify,
//   enharmonic,
//   property
// }

// /** NOTE PROPERTY METHODS */

// export const name = (note: string) => property('name', note);
// export const letter = (note: string) => property('letter', note);
// export const step = (note: string) => property('step', note);
// export const accidental = (note: string) => property('accidental', note);
// export const alteration = (note: string) => property('alteration', note);
// export const octave = (note: string) => property('octave', note);
// export const pc = (note: string) => property('pc', note);
// export const chroma = (note: string) => property('chroma', note);
// export const midi = (note: string) => property('midi', note);
// export const frequency = (note: string) => property('frequency', note);
