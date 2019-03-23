import { isString } from '../helpers';
import { EMPTY_NOTE, tokenize, WITH_SHARPS, WITH_FLATS, NO_NOTE } from './theory';


interface NoteProps {
  name: string;
  letter: string;
  step: number;
  accidental: string;
  alteration: number;
  octave: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;
};

const letterIndex = (letter) => WITH_SHARPS.indexOf(letter);
const tuneNote = (index, tuning = 440) => 440 * 2 ** ((index - 69) / 12);

export const getProperties = (noteName: string): any => {
  const tokens = tokenize(noteName);
  if (!tokens) { return EMPTY_NOTE; }
  let { letter, accidental, octave } = tokens;

  const offset = letterIndex(letter);
  const alteration = Accidental.alteration(accidental);
  const pc = letter + accidental;
  const altered = (offset + alteration);
  const alteredOct = Math.floor(altered / 12);
  let chroma = alteredOct < 0 ? (altered - alteredOct * 12) % 12 : altered % 12;
  const midi = (octave + 1) * 12 + chroma;
  const freq = tuneNote(midi, 440);

  return {
    letter,
    offset,
    accidental,
    alteration,
    octave: Math.floor(midi / 12) + alteredOct - 1,
    pc,
    chroma,
    midi,
    freq,
    pitch: pc + octave,
    simple: noteFromChroma(chroma)
  };
};

const cache = {} as { [key: string]: any };

export const properties = (str?: string) => {
  if (!isString(str)) return NO_NOTE;
  return cache[str] || (cache[str] = getProperties(str));
};

const noteFromChroma = (chroma, octave = 4, isSharp = true) => {
  return (isSharp ? WITH_SHARPS[chroma] : WITH_FLATS[chroma]) + octave;
}

export const simplify = (note, sameSign = true) => {

  const { chroma, alteration, octave } = getProperties(note);

  console.log(getProperties(note));

  const isSharp = alteration >= 0;

  return (isSharp
    ? (sameSign ? WITH_SHARPS[chroma] : WITH_FLATS[chroma])
    : (sameSign ? WITH_FLATS[chroma] : WITH_SHARPS[chroma])) + octave;

};

const enharmonic = (note) => simplify(note, false);


// interface PitchClassType {
//   name: string,
//   index: number
// };

// export const PitchClass = {

//   CLASSES: {
//     'b': WITH_FLATS,
//     '#': WITH_SHARPS
//   },

//   isValid: function (pc: string): boolean {
//     return ALL_NOTES.indexOf(pc) > -1
//       ? true
//       : false
//   },

//   getChroma: function (letter: string, accidental: string): number {
//     const pc = letter + accidental;
//     if (!this.isValid(pc)) return null;
//     return eq(accidental, 'b')
//       ? this.CLASSES['b'].indexOf(pc)
//       : this.CLASSES['#'].indexOf(pc);
//   },

//   withChroma: function (chroma: number, type = '#'): PitchClassType {
//     return {
//       name: this.CLASSES[type][chroma],
//       index: chroma
//     }
//   },

//   build: function (letter: string, accidental: string): PitchClassType {
//     return {
//       name: letter + accidental,
//       index: this.getChroma(letter, accidental)
//     };
//   }
// };

// interface PitchType {
//   name: string,
//   index: number
// };

// export const Pitch = {
//   octaveSize: function (octave: number): number {
//     return 12 * (octave + 1);
//   },

//   octaveSpan: function (midi: number): number {
//     return compose(decrement, floor, normalize)(midi);
//   },

//   getMidi: function (octave: number, chroma: number): number {
//     if (!(isInteger(octave) && isInteger(chroma))) return null;
//     return this.octaveSize(octave) + chroma;
//   },

//   simplify: function (note: string, withSameAccidentals = true): PitchType {
//     const tokens = tokenize(note);
//     const { letter, accident, octave } = tokens;

//     const chroma = (PitchClass.getChroma(letter, '') + Accidental.getOffset(accident)) % 12;

//     const isSharp = Accidental.isSharp(accident);
//     const [type, enharmonic] = isSharp ? ['#', 'b'] : ['b', '#'];

//     const pc = withSameAccidentals
//       ? PitchClass.withChroma(chroma, type)
//       : PitchClass.withChroma(chroma, enharmonic);

//     return this.build(pc, octave);
//   },

//   enharmonic: function (note: string): PitchType {
//     return this.simplify(note, false);
//   },

//   build: function (pc: PitchClassType, octave: number): PitchType {
//     return ({
//       name: pc.name + octave,
//       index: this.getMidi(octave, pc.index)
//     });
//   }
// }

// interface FrequencyType {
//   value: number
// }

// export const Frequency = {
//   isValid: function (freq: number): boolean {
//     return typeof freq === 'number' && freq > 0;
//   },

//   fromMidi: function (midi: number, tuning = 440): FrequencyType {
//     if (!isInteger(midi)) return null;
//     return { value: tuning * compose(pow2, normalize, subC(69))(midi) };
//   }
// }

// interface BasicToneType {
//   tone: string,
//   index: number,
//   position: number,
//   step: number
// };

// export const BasicTone = {
//   whiteKeyIndex: function (tone: string) { return LETTERS.indexOf(tone); },
//   naturalToneIndex: function (tone: string) { return WHITE_KEYS[this.whiteKeyIndex(tone)]; },

//   build: function (letter: string): BasicToneType {
//     return {
//       tone: letter,
//       index: this.whiteKeyIndex(letter),
//       position: this.naturalToneIndex(letter),
//       step: this.whiteKeyIndex(letter) + 1
//     }
//   }
// }

// export const getNoteProps = (noteName: string): any => {
//   const tokens = tokenize(noteName);
//   if (!tokens) { return EMPTY_NOTE; }
//   const { letter, accident, octave } = tokens;
//   const natural = BasicTone.build(letter);
//   const accidental = Accidental.build(accident);
//   const pc = PitchClass.build(letter, accidental.type);
//   const pitch = Pitch.build(pc, octave);
//   const frequency = Frequency.fromMidi(pitch.index);

//   return {
//     frequency,
//     letter,
//     octave,
//     natural,
//     accidental,
//     pc,
//     pitch,
//   };
// };

// const cache = {} as { [key: string]: any };

// export const properties = (str?: string) => {
//   if (!isString(str)) return NO_NOTE;
//   return cache[str] || (cache[str] = getNoteProps(str));
// };

// // Properties
// export const property = curry((name: string, note: string) => getNoteProps(note)[name]);
// export const frequency = (note: string) => property('frequency', note);
// export const letter = (note: string) => property('letter', note);
// export const octave = (note: string) => property('octave', note);
// export const natural = (note: string) => property('natural', note);
// export const accidental = (note: string) => property('accidental', note);
// export const pc = (note: string) => property('pc', note);
// export const pitch = (note: string) => property('pitch', note);

// // Subtypes
// export const alteration = (note: string) => accidental(note).alteration;
// // export const pc = (note: string) => pc(note).class;
// export const chroma = (note: string) => pc(note).index;
// export const name = (note: string) => pitch(note).name;
// export const midi = (note: string) => pitch(note).index;


