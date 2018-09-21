import * as T from './theory';
import { compose, curry, firstLetter, and, or, withTick } from '../helpers';
import { property } from './properties';


namespace ERROR {

    export const NEED_MORE_ARGS = curry((dict: any) => {
      console.log(`Couldn't create property: '${dict.forProp.toUpperCase()}' just from ${dict.fromProp}: '${dict.withValue}'. Try with ${dict.need} included.`);
      return undefined;
    });

    export const NO_FACT_FOR_PARAM = curry((dict: any) => {
      console.log(`Couldn't create property: ${dict.forProp} from ${dict.fromProp}: '${dict.withValue}'`);
      return undefined;
    });

    export const errorDict = (prop, from, value, needed?) => {
      return { forProp: prop, fromProp: from, withValue: value, need: needed };
    };
}

const dict = ERROR.errorDict;

namespace LETTER {
    const fromLetter = letter => letter;
    const fromName = name => firstLetter(name);
    const fromPc = pc => firstLetter(pc);
    const fromChroma = chroma => compose(fromPc, PC.FACTORY('chroma'))(chroma);
    const fromMidi = midi => fromChroma(midi % 12);
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromStep = step => T.LETTERS[step];
    const fromAcc = acc => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'accidental', acc));
    const fromAlt = alt => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'alteration', alt));
    const fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'octave', oct));

    export const FROM = {
      letter:     fromLetter,
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

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

namespace STEP {
    const fromLetter = letter => T.LETTERS.indexOf(letter);
    export const FACTORY = curry((fromProp, withValue) => compose(fromLetter, LETTER.FACTORY)(fromProp, withValue));
}

namespace ACCIDENTAL {
    const fromName = name => name.length === 1 ? '' : name.substring(1);
    const idAccidental = acc => acc;
    const fromPc = pc => fromName(pc);
    const fromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
    const fromChroma = chroma => compose(fromName, PC.FACTORY('chroma'))(chroma);
    const fromMidi = midi => compose(fromPc, PC.FACTORY('midi'))(midi);
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = letter => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'letter', letter));
    const fromStep = step => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'step', step));
    const fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'octave', oct));

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

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

namespace ALTERATION {
  const fromAccidental = acc =>  firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
  export const FACTORY = curry((fromProp, withValue) => compose(fromAccidental, ACCIDENTAL.FACTORY)(fromProp, withValue));
}

namespace PC {
    const fromName = name => property('pc', name);
    const idPc = pc => pc;
    const fromChroma = chroma => T.SHARPS[chroma];
    const fromMidi = midi => fromChroma(midi % 12);
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'));
    const fromLetter = letter => ERROR.NEED_MORE_ARGS(dict('pc', 'letter', letter, or(['accidental', 'alteration'])));
    const fromStep = step => ERROR.NEED_MORE_ARGS(dict('pc', 'step', step, or(['accidental', 'alteration'])));
    const fromAcc = acc => ERROR.NEED_MORE_ARGS(dict('pc', 'octave', acc, or(['letter', 'step'])));
    const fromAlt = alt => ERROR.NEED_MORE_ARGS(dict('pc', 'octave', alt, or(['letter', 'step'])));
    const fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('pc', 'octave', oct));

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

    export const FACTORY = curry((fromProp, withValue) => FROM[fromProp](withValue));
}

namespace CHROMA {
  const fromPc = pc => pc.indexOf('#') > 0 ? T.SHARPS.indexOf(pc) : T.FLATS.indexOf(pc);
  export const FACTORY = curry((fromProp, withValue) => compose(fromPc, PC.FACTORY)(fromProp, withValue));
}

namespace MIDI {
    const fromName = name => property('midi', name);
    const idMidi = midi => midi;
    const fromFreq = (freq, tuning = 440) => {
      return Math.ceil(12 * Math.log2(freq / tuning) + 69);
    };
    const fromLetter = letter => ERROR.NEED_MORE_ARGS(dict('midi', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true)));
    const fromStep = step => ERROR.NEED_MORE_ARGS(dict('midi', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true)));
    const fromAccidental = acc => ERROR.NEED_MORE_ARGS(dict('midi', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true)));
    const fromAlteration = alt => ERROR.NEED_MORE_ARGS(dict('midi', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true)));
    const fromPc = pc => ERROR.NEED_MORE_ARGS(dict('midi', 'pc', pc, and(['octave'])));
    const fromChroma = chroma => ERROR.NEED_MORE_ARGS(dict('midi', 'chroma', chroma, and(['octave'])));
    const fromOctave = oct => ERROR.NEED_MORE_ARGS(dict('midi', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true)));

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
      return 2 ** ((midi - 69) / 12) * tuning;
    };

    export const FACTORY = curry((fromProp, withValue) => compose(fromMidi, MIDI.FACTORY)(fromProp, withValue));
}

namespace OCTAVE {
    const fromName = name => property('octave', name);
    const idOctave = octave => octave;
    const fromMidi = midi => Math.floor(midi / 12) - 1;
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = letter => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'letter', letter));
    const fromAcc = acc => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'accidental', acc));
    const fromPc = pc => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'pc', pc));
    const fromStep = step => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'step', step));
    const fromAlt = alt => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'alteration', alt));
    const fromChroma = chroma => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'chroma', chroma));

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
      const o = Math.floor(midi / 12) - 1;
      return pc + o;
    };
    const fromFreq = freq => compose(fromMidi, MIDI.FACTORY('freq'))(freq);
    const fromLetter = letter => false;
    const fromAcc = acc => false;
    const fromOct = oct => false;
    const fromPc = pc => false;
    const fromStep = step => false;
    const fromAlt = alt => false;
    const fromChroma = chroma => false;

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

export const PROP_FACTORY = curry((whatProp, fromProp, withValue) =>
             PROP_FACTORY_DICT[whatProp](fromProp, withValue));

console.log('PC creates: ', PC.FROM);
