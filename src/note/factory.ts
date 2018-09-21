import * as T from './theory';
import { compose, curry, firstLetter } from '../helpers';
import { property } from './properties';


const NEED_MORE_ARGS = curry((dict: any) => {
  console.log('NEED ARGS: ', dict);
  console.log(`Couldn't create property: '${dict.forProp.toUpperCase()}' from ${dict.fromProp}: '${dict.withValue}'. Args: ${dict.need} needed.`);
  return undefined;
});

const NO_FACT_FOR_PARAM = curry((dict: any) => {
  console.log('DICT: ', dict);
  console.log(`Couldn't create property: ${dict.forProp} from ${dict.fromProp}: '${dict.withValue}'`);
  return undefined;
});

const FACTORY_ERRORS = {
  NEED_MORE_ARGS,
  NO_FACT_FOR_PARAM
};

const errorDict = (prop, from, value, needed?) => {
  return { forProp: prop, fromProp: from, withValue: value, need: needed };
};

const FACTORY_ERROR = curry((type: string, dict: any) => {
  return FACTORY_ERRORS[type](dict);
});

const withTick = arr => arr.map(el => `'${el}'`);

const or = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return argsWithTick.join(' OR ');
};

const and = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return `[ ${argsWithTick.join(', ')} ]`;
};


/* Letter */

const letterFromLetter = letter => letter;
const letterFromName = name => firstLetter(name);
const letterFromPc = pc => firstLetter(pc);
const letterFromChroma = chroma => compose(letterFromPc, pcFromChroma)(chroma);
const letterFromMidi = midi => letterFromChroma(midi % 12);
const letterFromFreq = freq => compose(letterFromMidi, midiFromFreq)(freq);
const letterFromStep = step => T.LETTERS[step];
const letterFromAcc = acc => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'accidental', acc));
const letterFromAlt = alt => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'alteration', alt));
const letterFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'octave', oct));

const letterFactoryDict = {
  letter:     letterFromLetter,
  name:       letterFromName,
  pc:         letterFromPc,
  step:       letterFromStep,
  chroma:     letterFromChroma,
  midi:       letterFromMidi,
  frequency:  letterFromFreq,
  accidental: letterFromAcc,
  alteration: letterFromAlt,
  octave:     letterFromOct
};

const letterFactory = curry((fromProp, withValue) => letterFactoryDict[fromProp](withValue));


/* Step */
const stepFromLetter = letter => T.LETTERS.indexOf(letter);
const stepFactory = curry((fromProp, withValue) => compose(stepFromLetter, letterFactory)(fromProp, withValue));



/* Accidental */
const accFromName = name => name.length === 1 ? '' : name.substring(1);
const idAcc = acc => acc;
const accFromPc = pc => accFromName(pc);
const accFromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
const accFromChroma = chroma => compose(accFromName, pcFromChroma)(chroma);
const accFromMidi = midi => compose(accFromPc, pcFromMidi)(midi);
const accFromFreq = freq => compose(accFromMidi, midiFromFreq)(freq);
const accFromLetter = letter => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'letter', letter));
const accFromStep = step => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'step', step));
const accFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'octave', oct));

const accFactoryDict = {
  accidental: idAcc,
  name:       accFromName,
  pc:         accFromPc,
  alteration: accFromAlt,
  chroma:     accFromChroma,
  midi:       accFromMidi,
  frequency:  accFromFreq,
  letter:     accFromLetter,
  step:       accFromStep,
  octave:     accFromOct,
};

const accFactory = curry((fromProp, withValue) => accFactoryDict[fromProp](withValue));


/* Alteration */
const altFromAcc = acc =>  firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
const altFactory = curry((fromProp, withValue) => compose(altFromAcc, accFactory)(fromProp, withValue));


/* PC */
const pcFromName = name => property('pc', name);
const idPc = pc => pc;
const pcFromChroma = chroma => T.SHARPS[chroma];
const pcFromMidi = midi => pcFromChroma(midi % 12);
const pcFromFreq = freq => compose(pcFromMidi, midiFromFreq);
const pcFromLetter = letter => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'letter', letter, or(['accidental', 'alteration'])));
const pcFromStep = step => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'step', step, or(['accidental', 'alteration'])));
const pcFromAcc = acc => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'octave', acc, or(['letter', 'step'])));
const pcFromAlt = alt => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'octave', alt, or(['letter', 'step'])));
const pcFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('pc', 'octave', oct));

const pcFactoryDict = {
  pc:         idPc,
  name:       pcFromName,
  chroma:     pcFromChroma,
  midi:       pcFromMidi,
  frequency:  pcFromFreq,
  letter:     pcFromLetter,
  step:       pcFromStep,
  accidental: pcFromAcc,
  alteration: pcFromAlt,
  octave:     pcFromOct
};

const pcFactory = curry((fromProp, withValue) => pcFactoryDict[fromProp](withValue));


/* Chroma */
const chromaFromPc = pc => pc.indexOf('#') > 0 ? T.SHARPS.indexOf(pc) : T.FLATS.indexOf(pc);
const chromaFactory = curry((fromProp, withValue) => compose(chromaFromPc, pcFactory)(fromProp, withValue));


/* MIDI */
const midiFromName = name => property('midi', name);
const idMidi = midi => midi;
const midiFromFreq = (freq, tuning = 440) => {
  return Math.ceil(12 * Math.log2(freq / tuning) + 69);
};
const midiFromLetter = letter => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'letter', and([or(['alteration', 'accidental']), or(['octave'])], true)));
const midiFromStep = step => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'step', and([or(['alteration', 'accidental']), or(['octave'])], true)));
const midiFromAccidental = acc => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'accidental', and([or(['letter', 'step']), or(['octave'])], true)));
const midiFromAlteration = alt => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'alteration', and([or(['letter', 'step']), or(['octave'])], true)));
const midiFromPc = pc => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'pc', and(['octave'])));
const midiFromChroma = chroma => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'chroma', and(['octave'])));
const midiFromOctave = oct => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('midi', 'octave', and([or(['letter', 'step']), or(['alteration', 'accidental'])], true)));

const midiFactoryDict = {
  midi:       idMidi,
  frequency:  midiFromFreq,
  name:       midiFromName,
  letter:     midiFromLetter,
  step:       midiFromStep,
  acc:        midiFromAccidental,
  alt:        midiFromAlteration,
  pc:         midiFromPc,
  chroma:     midiFromChroma,
  oct:        midiFromOctave
};

const midiFactory = curry((fromProp, withValue) => midiFactoryDict[fromProp](withValue));


/* Frequency */
const freqFromMidi = (midi: number, tuning = 440): number => {
  return 2 ** ((midi - 69) / 12) * tuning;
};

const freqFactory = curry((fromProp, withValue) => compose(freqFromMidi, midiFactory)(fromProp, withValue));


/* Octave */
const octFromName = name => property('octave', name);
const idOct = octave => octave;
const octFromMidi = midi => Math.floor(midi / 12) - 1;
const octFromFreq = freq => compose(octFromMidi, midiFromFreq)(freq);
const octFromLetter = letter => false;
const octFromAcc = acc => false;
const octFromPc = pc => false;
const octFromStep = step => false;
const octFromAlt = alt => false;
const octFromChroma = chroma => false;

const octFactoryDict = {
  octave:     idOct,
  name:       octFromName,
  midi:       octFromMidi,
  frequency:  octFromFreq,
  letter:     octFromLetter,
  accidental: octFromAcc,
  pc:         octFromPc,
  step:       octFromStep,
  alteration: octFromAlt,
  chroma:     octFromChroma,
};

const octFactory = curry((fromProp, withValue) => octFactoryDict[fromProp](withValue));


/* Name */
const idName = name => name;
const nameFromMidi = (midi) => {
  const midiValue = Math.round(midi);
  const pc = T.SHARPS[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
};
const nameFromFreq = freq => compose(nameFromMidi, midiFromFreq)(freq);
const nameFromLetter = letter => false;
const nameFromAcc = acc => false;
const nameFromOct = oct => false;
const nameFromPc = pc => false;
const nameFromStep = step => false;
const nameFromAlt = alt => false;
const nameFromChroma = chroma => false;

const nameFactoryDict = {
  name:       idName,
  midi:       nameFromMidi,
  frequency:  nameFromFreq,
  letter:     nameFromLetter,
  accidental: nameFromAcc,
  octave:     nameFromOct,
  pc:         nameFromPc,
  step:       nameFromStep,
  alteration: nameFromAlt,
  chroma:     nameFromChroma,
};

const nameFactory = curry((fromProp, withValue) => nameFactoryDict[fromProp](withValue));

const notePropFactoryDict = {
  name:       nameFactory,
  letter:     letterFactory,
  accidental: accFactory,
  octave:     octFactory,
  pc:         pcFactory,
  step:       stepFactory,
  alteration: altFactory,
  chroma:     chromaFactory,
  midi:       midiFactory,
  frequency:  freqFactory
};

export const NOTE_PROP_FACTORY = curry((whatProp, fromProp, withValue) => notePropFactoryDict[whatProp](fromProp, withValue));

// const prop = NOTE_PROP_FACTORY('letter', 'accidental', '4');
// console.log(prop);
