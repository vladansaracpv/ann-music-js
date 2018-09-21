import * as T from './theory';
import { compose, curry, firstLetter, and, or, withTick } from '../helpers';
import { property } from './properties';


namespace ERROR {

    export const NEED_MORE_ARGS = curry((dict: any) => {
      console.log(`Couldn't create property:${dict.forProp.toUpperCase()} just from property:${dict.fromProp.toUpperCase()} = '${dict.withValue}'. Try with params: ${dict.need} included.`);
      return undefined;
    });

    export const NO_FACT_FOR_PARAM = curry((dict: any) => {
      console.log(`Couldn't create property:${dict.forProp.toUpperCase()} from property:${dict.fromProp.toUpperCase()} = '${dict.withValue}'`);
      return undefined;
    });

    export const errorDict = (props, value, needed?) => {
      const params = props.split(' <= ');
      return { forProp: params[0], fromProp: params[1], withValue: value, need: needed };
    };
}

const dict = ERROR.errorDict;

namespace LETTER {
    const lORs = (isStep) => isStep ? 'step' : 'letter';
    const idLetter = (letter, isStep) => letter;
    const fromName = (name, isStep) => firstLetter(name);
    const fromPc = (pc, isStep) => firstLetter(pc);
    const fromChroma = (chroma, isStep) => compose(fromPc, PC.FACTORY('chroma'))(chroma);
    const fromMidi = (midi, isStep) => fromChroma(midi % 12, isStep);
    const fromFreq = (freq, isStep) => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromStep = (step, isStep) => T.LETTERS[step];
    const fromAcc = (acc, isStep) => ERROR.NO_FACT_FOR_PARAM(dict(`${lORs(isStep)} <= accidental`, acc));
    const fromAlt = (alt, isStep) => ERROR.NO_FACT_FOR_PARAM(dict(`${lORs(isStep)} <= alteration`, alt));
    const fromOct = (oct, isStep) => ERROR.NO_FACT_FOR_PARAM(dict(`${lORs(isStep)} <= octave`, oct));

    export const FROM = {
      letter:     idLetter,
      name:       fromName,
      pc:         fromPc,
      step:       fromStep,
      chroma:     fromChroma,
      midi:       fromMidi,
      frequency:  fromFreq,
      accidental: fromAcc,
      alteration: fromAlt,
      octave:     fromOct
    };

    export const FACTORY = curry((fromProp, withValue, isStep = false) => FROM[fromProp](withValue, isStep));
}

namespace STEP {
    const fromLetter = letter => T.LETTERS.indexOf(letter);
    export const FACTORY = curry((fromProp, withValue) => compose(fromLetter, LETTER.FACTORY)(fromProp, withValue, true));
}

namespace ACCIDENTAL {
    const accORalt = (isAlt) => isAlt ? 'alteration' : 'accidental';
    const fromName = (name, isAlt) => name.length === 1 ? '' : name.substring(1);
    const idAccidental = (acc, isAlt) => acc;
    const fromPc = (pc, isAlt) => fromName(pc, isAlt);
    const fromAlt = (alt, isAlt) => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
    const fromChroma = (chroma, isAlt) => compose(fromName, PC.FACTORY('chroma'))(chroma);
    const fromMidi = (midi, isAlt) => compose(fromPc, PC.FACTORY('midi'))(midi);
    const fromFreq = (freq, isAlt) => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = (letter, isAlt) => ERROR.NO_FACT_FOR_PARAM(dict(`${ accORalt(isAlt) } <= letter`, letter));
    const fromStep = (step, isAlt) => ERROR.NO_FACT_FOR_PARAM(dict(`${ accORalt(isAlt) } <= step`, step));
    const fromOct = (oct, isAlt) => ERROR.NO_FACT_FOR_PARAM(dict(`${ accORalt(isAlt) } <= octave`, oct));

    export const FROM = {
      accidental: idAccidental,
      name:       fromName,
      pc:         fromPc,
      alteration: fromAlt,
      chroma:     fromChroma,
      midi:       fromMidi,
      frequency:  fromFreq,
      letter:     fromLetter,
      step:       fromStep,
      octave:     fromOct,
    };

    export const FACTORY = curry((fromProp, withValue, isAlt = false) => FROM[fromProp](withValue, isAlt));
}

namespace ALTERATION {
  const fromAccidental = acc =>  firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
  export const FACTORY = curry((fromProp, withValue) => compose(fromAccidental, ACCIDENTAL.FACTORY)(fromProp, withValue, true));
}

namespace PC {
    const pORc = (isChroma) => isChroma ? 'chroma' : 'pc';
    const fromName = (name, isChroma) => property('pc', name);
    const idPc = (pc, isChroma) => pc;
    const fromChroma = (chroma, isChroma) => T.SHARPS[chroma];
    const fromMidi = (midi, isChroma) => fromChroma(midi % 12, isChroma);
    const fromFreq = (freq, isChroma) => compose(fromMidi, MIDI.FACTORY('freq'));
    const fromLetter = (letter, isChroma) => ERROR.NEED_MORE_ARGS(dict(` ${ pORc(isChroma) } <= letter`, letter, '[ accidental | alteration ]'));
    const fromStep = (step, isChroma) => ERROR.NEED_MORE_ARGS(dict(` ${ pORc(isChroma) } <= step`, step, '[ accidental | alteration ]'));
    const fromAcc = (acc, isChroma) => ERROR.NEED_MORE_ARGS(dict(` ${ pORc(isChroma) } <= octave`, acc, '[ letter | step ]'));
    const fromAlt = (alt, isChroma) => ERROR.NEED_MORE_ARGS(dict(` ${ pORc(isChroma) } <= octave`, alt, '[ letter | step ]'));
    const fromOct = (oct, isChroma) => ERROR.NO_FACT_FOR_PARAM(dict(` ${ pORc(isChroma) } <= octave`, oct));

    export const FROM = {
      pc:         idPc,
      name:       fromName,
      chroma:     fromChroma,
      midi:       fromMidi,
      frequency:  fromFreq,
      letter:     fromLetter,
      step:       fromStep,
      accidental: fromAcc,
      alteration: fromAlt,
      octave:     fromOct
    };

    export const FACTORY = curry((fromProp, withValue, isChroma = false) => FROM[fromProp](withValue, isChroma));
}

namespace CHROMA {
  const fromPc = pc => pc.indexOf('#') > 0 ? T.SHARPS.indexOf(pc) : T.FLATS.indexOf(pc);
  export const FACTORY = curry((fromProp, withValue) => compose(fromPc, PC.FACTORY)(fromProp, withValue, true));
}

namespace MIDI {
    const mORf = isFreq => isFreq ? 'frequency' : 'midi';
    const fromName = (name, isFreq) => property('midi', name);
    const idMidi = (midi, isFreq) => midi;
    const fromFreq = (freq, isFreq, tuning = 440) => {
      return Math.ceil(12 * Math.log2(freq | tuning) + 69);
    };

    const fromLetter = (letter, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= letter`, letter, '[ alteration | accidental, octave ]'));
    const fromStep = (step, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= step`, step, '[ alteration | accidental, octave ]'));
    const fromAccidental = (acc, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= accidental`, acc, '[ letter | step, octave ]'));
    const fromAlteration = (alt, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= alteration`, alt, '[ letter | step, octave ]'));
    const fromPc = (pc, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= pc`, pc, '[ octave ]'));
    const fromChroma = (chroma, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= chroma`, chroma, '[ octave ]'));
    const fromOctave = (oct, isFreq) => ERROR.NEED_MORE_ARGS(dict(`${ mORf(isFreq) } <= octave`, oct, '[ letter|step, alteration|accidental ]'));

    export const FROM = {
      midi:       idMidi,
      frequency:  fromFreq,
      name:       fromName,
      letter:     fromLetter,
      step:       fromStep,
      accidental: fromAccidental,
      alteration: fromAlteration,
      pc:         fromPc,
      chroma:     fromChroma,
      octave:     fromOctave
    };

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

namespace FREQUENCY {
    const fromMidi = (midi: number, tuning = 440): number => {
      return 2 ** ((midi - 69) | 12) * tuning;
    };

    export const FACTORY = curry((fromProp, withValue, isFreq = false) => compose(fromMidi, MIDI.FACTORY)(fromProp, withValue, true));
}

namespace OCTAVE {
    const fromName = name => property('octave', name);
    const idOctave = octave => octave;
    const fromMidi = midi => Math.floor(midi | 12) - 1;
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = letter => ERROR.NO_FACT_FOR_PARAM(dict('octave:letter', letter));
    const fromAcc = acc => ERROR.NO_FACT_FOR_PARAM(dict('octave:accidental', acc));
    const fromPc = pc => ERROR.NO_FACT_FOR_PARAM(dict('octave:pc', pc));
    const fromStep = step => ERROR.NO_FACT_FOR_PARAM(dict('octave:step', step));
    const fromAlt = alt => ERROR.NO_FACT_FOR_PARAM(dict('octave:alteration', alt));
    const fromChroma = chroma => ERROR.NO_FACT_FOR_PARAM(dict('octave:chroma', chroma));

    export const FROM = {
      octave:     idOctave,
      name:       fromName,
      midi:       fromMidi,
      frequency:  fromFreq,
      letter:     fromLetter,
      accidental: fromAcc,
      pc:         fromPc,
      step:       fromStep,
      alteration: fromAlt,
      chroma:     fromChroma,
    };

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

namespace NAME {
    const idName = name => name;
    const fromMidi = (midi) => {
      const midiValue = Math.round(midi);
      const pc = T.SHARPS[midi % 12];
      const o = Math.floor(midi | 12) - 1;
      return pc + o;
    };
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = letter => ERROR.NEED_MORE_ARGS(dict('name <= letter', letter, '[ alteration | accidental, octave ]'));
    const fromAcc = acc => ERROR.NEED_MORE_ARGS(dict('name <= accidental', acc, '[ letter | step, octave ]'));
    const fromOct = oct => ERROR.NEED_MORE_ARGS(dict('name <= octave', oct, '[ letter | step, accidental | alteration ]'));
    const fromPc = pc => ERROR.NEED_MORE_ARGS(dict('name <= pc', pc, '[ octave ]'));
    const fromStep = step => ERROR.NEED_MORE_ARGS(dict('name <= step', step, '[ alteration | accidental, octave ]'));
    const fromAlt = alt => ERROR.NEED_MORE_ARGS(dict('name <= alteration', alt, '[ letter | step, octave ]'));
    const fromChroma = chroma => ERROR.NEED_MORE_ARGS(dict('name <= chroma', chroma, '[ octave ]'));

    export const FROM = {
      name:       idName,
      midi:       fromMidi,
      frequency:  fromFreq,
      letter:     fromLetter,
      accidental: fromAcc,
      octave:     fromOct,
      pc:         fromPc,
      step:       fromStep,
      alteration: fromAlt,
      chroma:     fromChroma,
    };

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

const PROP_FACTORY_DICT = {
  name:       NAME.FACTORY,
  letter:     LETTER.FACTORY,
  accidental: ACCIDENTAL.FACTORY,
  octave:     OCTAVE.FACTORY,
  pc:         PC.FACTORY,
  step:       STEP.FACTORY,
  alteration: ALTERATION.FACTORY,
  chroma:     CHROMA.FACTORY,
  midi:       MIDI.FACTORY,
  frequency:  FREQUENCY.FACTORY
};

export const PROP_FACTORY = curry((whatProp, fromProp, withValue) => {
  return PROP_FACTORY_DICT[whatProp](fromProp, withValue);
});


const prop = PROP_FACTORY('midi', 'letter', '-1');