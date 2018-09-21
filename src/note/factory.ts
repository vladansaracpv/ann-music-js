import * as T from './theory';
import { compose, curry, firstLetter } from '../helpers';
import { property } from './properties';


const NEED_MORE_ARGS = curry((dict: any) => {
  console.log(`Couldn't create property: '${dict.forProp.toUpperCase()}' from ${dict.fromProp}: '${dict.withValue}'. Args: ${dict.need} needed.`);
  return undefined;
});

const NO_FACT_FOR_PARAM = curry((dict: any) => {
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


namespace LETTER {
    const letterFromLetter = letter => letter;
    const letterFromName = name => firstLetter(name);
    const letterFromPc = pc => firstLetter(pc);
    const letterFromChroma = chroma => compose(letterFromPc, PC.FACTORY('chroma'))(chroma);
    const letterFromMidi = midi => letterFromChroma(midi % 12);
    const letterFromFreq = freq => compose(letterFromMidi, MIDI.FACTORY('freq'))(freq);
    const letterFromStep = step => T.LETTERS[step];
    const letterFromAcc = acc => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'accidental', acc));
    const letterFromAlt = alt => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'alteration', alt));
    const letterFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('letter', 'octave', oct));

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

namespace STEP {
    const stepFromLetter = letter => T.LETTERS.indexOf(letter);
    export const FACTORY = curry((fromProp, withValue) => compose(stepFromLetter, LETTER.FACTORY)(fromProp, withValue));
}

namespace ACCIDENTAL {
    const accFromName = name => name.length === 1 ? '' : name.substring(1);
    const idAcc = acc => acc;
    const accFromPc = pc => accFromName(pc);
    const accFromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
    const accFromChroma = chroma => compose(accFromName, PC.FACTORY('chroma'))(chroma);
    const accFromMidi = midi => compose(accFromPc, PC.FACTORY('midi'))(midi);
    const accFromFreq = freq => compose(accFromMidi, MIDI.FACTORY('freq'))(freq);
    const accFromLetter = letter => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'letter', letter));
    const accFromStep = step => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'step', step));
    const accFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('accidental', 'octave', oct));

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

namespace ALTERATION {
  const altFromAcc = acc =>  firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
  export const FACTORY = curry((fromProp, withValue) => compose(altFromAcc, ACCIDENTAL.FACTORY)(fromProp, withValue));
}

namespace PC {
    const pcFromName = name => property('pc', name);
    const idPc = pc => pc;
    const pcFromChroma = chroma => T.SHARPS[chroma];
    const pcFromMidi = midi => pcFromChroma(midi % 12);
    const pcFromFreq = freq => compose(pcFromMidi, MIDI.FACTORY('freq'));
    const pcFromLetter = letter => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'letter', letter, or(['accidental', 'alteration'])));
    const pcFromStep = step => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'step', step, or(['accidental', 'alteration'])));
    const pcFromAcc = acc => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'octave', acc, or(['letter', 'step'])));
    const pcFromAlt = alt => FACTORY_ERROR('NEED_MORE_ARGS', errorDict('pc', 'octave', alt, or(['letter', 'step'])));
    const pcFromOct = oct => FACTORY_ERROR('NO_FACT_FOR_PARAM', errorDict('pc', 'octave', oct));

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

namespace CHROMA {
  const chromaFromPc = pc => pc.indexOf('#') > 0 ? T.SHARPS.indexOf(pc) : T.FLATS.indexOf(pc);
  export const FACTORY = curry((fromProp, withValue) => compose(chromaFromPc, PC.FACTORY)(fromProp, withValue));
}

namespace MIDI {
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

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

namespace FREQUENCY {
    const freqFromMidi = (midi: number, tuning = 440): number => {
      return 2 ** ((midi - 69) / 12) * tuning;
    };

    export const FACTORY = curry((fromProp, withValue) => compose(freqFromMidi, MIDI.FACTORY)(fromProp, withValue));
}

namespace OCTAVE {
    const octFromName = name => property('octave', name);
    const idOct = octave => octave;
    const octFromMidi = midi => Math.floor(midi / 12) - 1;
    const octFromFreq = freq => compose(octFromMidi, MIDI.FACTORY('freq'))(freq);
    const octFromLetter = letter => false;
    const octFromAcc = acc => false;
    const octFromPc = pc => false;
    const octFromStep = step => false;
    const octFromAlt = alt => false;
    const octFromChroma = chroma => false;

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

namespace NAME {
    const idName = name => name;
    const nameFromMidi = (midi) => {
      const midiValue = Math.round(midi);
      const pc = T.SHARPS[midi % 12];
      const o = Math.floor(midi / 12) - 1;
      return pc + o;
    };
    const nameFromFreq = freq => compose(nameFromMidi, MIDI.FACTORY('freq'))(freq);
    const nameFromLetter = letter => false;
    const nameFromAcc = acc => false;
    const nameFromOct = oct => false;
    const nameFromPc = pc => false;
    const nameFromStep = step => false;
    const nameFromAlt = alt => false;
    const nameFromChroma = chroma => false;

    export const FACTORY_DICT = {
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

    export const FACTORY = curry((fromProp, withValue) => FACTORY_DICT[fromProp](withValue));
}

export const PROP_FACT_DICT = {
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

export const NOTE_PROP_FACTORY = curry((whatProp, fromProp, withValue) => PROP_FACT_DICT[whatProp](fromProp, withValue));

const prop = NOTE_PROP_FACTORY('letter', 'alteration', '4');
// console.log(prop);
