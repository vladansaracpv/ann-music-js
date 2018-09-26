import { Theory as T } from './theory';
import { compose, curry, firstLetter, and, or, withTick } from '../helpers';
import { property } from './properties';


export class ERROR {

  static NEED_MORE_ARGS = curry((dict: any) => {
    console.log(`Couldn't create property: '${dict.forProp.toUpperCase()}' just from ${dict.fromProp}: '${dict.withValue}'. Try with ${dict.need} included.`);
    return undefined;
  });

  static NO_FACT_FOR_PARAM = curry((dict: any) => {
    console.log(`Couldn't create property: ${dict.forProp} from ${dict.fromProp}: '${dict.withValue}'`);
    return undefined;
  });

  static errorDict = (prop, from, value, needed?) => {
    return { forProp: prop, fromProp: from, withValue: value, need: needed };
  };
}

const dict = ERROR.errorDict;

export class LETTER {
  static fromLetter = letter => letter;
  static fromName = name => firstLetter(name);
  static fromPc = pc => firstLetter(pc);
  static fromChroma = chroma => compose(LETTER.fromPc, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => LETTER.fromChroma(midi % 12);
  static fromFreq = freq => compose(LETTER.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromStep = step => T.LETTERS[step];
  static fromAcc = acc => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'accidental', acc));
  static fromAlt = alt => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'alteration', alt));
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('letter', 'octave', oct));

  static FROM = {
    letter:     LETTER.fromLetter,
    name:       LETTER.fromName,
    pc:         LETTER.fromPc,
    step:       LETTER.fromStep,
    chroma:     LETTER.fromChroma,
    midi:       LETTER.fromMidi,
    frequency:  LETTER.fromFreq,
    accidental: LETTER.fromAcc,
    alteration: LETTER.fromAlt,
    octave:     LETTER.fromOct
  };

  static FACTORY = curry((fromProp, withValue) => LETTER.FROM[fromProp](withValue));
}

export class STEP {
  static fromLetter = letter => T.LETTERS.indexOf(letter);
  static FACTORY = curry((fromProp, withValue) => compose(STEP.fromLetter, LETTER.FACTORY)(fromProp, withValue));
}

export class ACCIDENTAL {
  static fromName = name => name.length === 1 ? '' : name.substring(1);
  static idAccidental = acc => acc;
  static fromPc = pc => ACCIDENTAL.fromName(pc);
  static fromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
  static fromChroma = chroma => compose(ACCIDENTAL.fromName, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => compose(ACCIDENTAL.fromPc, PC.FACTORY('midi'))(midi);
  static fromFreq = freq => compose(ACCIDENTAL.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'letter', letter));
  static fromStep = step => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'step', step));
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('accidental', 'octave', oct));

  static FROM = {
    accidental: ACCIDENTAL.idAccidental,
    name:       ACCIDENTAL.fromName,
    pc:         ACCIDENTAL.fromPc,
    alteration: ACCIDENTAL.fromAlt,
    chroma:     ACCIDENTAL.fromChroma,
    midi:       ACCIDENTAL.fromMidi,
    frequency:  ACCIDENTAL.fromFreq,
    letter:     ACCIDENTAL.fromLetter,
    step:       ACCIDENTAL.fromStep,
    octave:     ACCIDENTAL.fromOct,
  };

  static FACTORY = curry((fromProp, withValue) => ACCIDENTAL.FROM[fromProp](withValue));
}

export class ALTERATION {
  static fromAccidental = acc =>  firstLetter(`${acc} `) === '#' ? acc.length : -acc.length;
  static FACTORY = curry((fromProp, withValue) => compose(ALTERATION.fromAccidental, ACCIDENTAL.FACTORY)(fromProp, withValue));
}

export class PC {
  static fromName = name => property('pc', name);
  static idPc = pc => pc;
  static fromChroma = chroma => T.SHARPS[chroma];
  static fromMidi = midi => PC.fromChroma(midi % 12);
  static fromFreq = freq => compose(PC.fromMidi, MIDI.FACTORY('freq'));
  static fromLetter = letter => ERROR.NEED_MORE_ARGS(dict('pc', 'letter', letter, or(['accidental', 'alteration'])));
  static fromStep = step => ERROR.NEED_MORE_ARGS(dict('pc', 'step', step, or(['accidental', 'alteration'])));
  static fromAcc = acc => ERROR.NEED_MORE_ARGS(dict('pc', 'octave', acc, or(['letter', 'step'])));
  static fromAlt = alt => ERROR.NEED_MORE_ARGS(dict('pc', 'octave', alt, or(['letter', 'step'])));
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM(dict('pc', 'octave', oct));

  static FROM = {
    pc:         PC.idPc,
    name:       PC.fromName,
    chroma:     PC.fromChroma,
    midi:       PC.fromMidi,
    frequency:  PC.fromFreq,
    letter:     PC.fromLetter,
    step:       PC.fromStep,
    accidental: PC.fromAcc,
    alteration: PC.fromAlt,
    octave:     PC.fromOct
  };

  static FACTORY = curry((fromProp, withValue) => PC.FROM[fromProp](withValue));
}

export class CHROMA {
  static fromPc = pc => pc.indexOf('#') > 0 ? T.SHARPS.indexOf(pc) : T.FLATS.indexOf(pc);
  static FACTORY = curry((fromProp, withValue) => compose(CHROMA.fromPc, PC.FACTORY)(fromProp, withValue));
}

export class MIDI {
  static fromName = name => property('midi', name);
  static idMidi = midi => midi;
  static fromFreq = (freq, tuning = 440) => {
    return Math.ceil(12 * Math.log2(freq / tuning) + 69);
  };

  static fromLetter = letter => ERROR.NEED_MORE_ARGS(dict('midi', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true)));
  static fromStep = step => ERROR.NEED_MORE_ARGS(dict('midi', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true)));
  static fromAccidental = acc => ERROR.NEED_MORE_ARGS(dict('midi', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true)));
  static fromAlteration = alt => ERROR.NEED_MORE_ARGS(dict('midi', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true)));
  static fromPc = pc => ERROR.NEED_MORE_ARGS(dict('midi', 'pc', pc, and(['octave'])));
  static fromChroma = chroma => ERROR.NEED_MORE_ARGS(dict('midi', 'chroma', chroma, and(['octave'])));
  static fromOctave = oct => ERROR.NEED_MORE_ARGS(dict('midi', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true)));

  static FROM = {
    midi:       MIDI.idMidi,
    frequency:  MIDI.fromFreq,
    name:       MIDI.fromName,
    letter:     MIDI.fromLetter,
    step:       MIDI.fromStep,
    accidental: MIDI.fromAccidental,
    alteration: MIDI.fromAlteration,
    pc:         MIDI.fromPc,
    chroma:     MIDI.fromChroma,
    octave:     MIDI.fromOctave
  };

  static FACTORY = curry((fromProp, withValue) => MIDI.FROM[fromProp](withValue));
}

export class FREQUENCY {
  static fromMidi = (midi: number, tuning = 440): number => {
    return 2 ** ((midi - 69) / 12) * tuning;
  };

  static FACTORY = curry((fromProp, withValue) => compose(FREQUENCY.fromMidi, MIDI.FACTORY)(fromProp, withValue));
}

export class OCTAVE {
  static fromName = name => property('octave', name);
  static idOctave = octave => octave;
  static fromMidi = midi => Math.floor(midi / 12) - 1;
  static fromFreq = freq => compose(OCTAVE.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'letter', letter));
  static fromAcc = acc => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'accidental', acc));
  static fromPc = pc => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'pc', pc));
  static fromStep = step => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'step', step));
  static fromAlt = alt => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'alteration', alt));
  static fromChroma = chroma => ERROR.NO_FACT_FOR_PARAM(dict('octave', 'chroma', chroma));

  static FROM = {
    octave:     OCTAVE.idOctave,
    name:       OCTAVE.fromName,
    midi:       OCTAVE.fromMidi,
    frequency:  OCTAVE.fromFreq,
    letter:     OCTAVE.fromLetter,
    accidental: OCTAVE.fromAcc,
    pc:         OCTAVE.fromPc,
    step:       OCTAVE.fromStep,
    alteration: OCTAVE.fromAlt,
    chroma:     OCTAVE.fromChroma,
  };

  static FACTORY = curry((fromProp, withValue) => OCTAVE.FROM[fromProp](withValue));
}

export class NAME {
  static idName = name => name;
  static fromMidi = (midi) => {
    const midiValue = Math.round(midi);
    const pc = T.SHARPS[midi % 12];
    const o = Math.floor(midi / 12) - 1;
    return pc + o;
  };
  static fromFreq = freq => compose(NAME.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => false;
  static fromAcc = acc => false;
  static fromOct = oct => false;
  static fromPc = pc => false;
  static fromStep = step => false;
  static fromAlt = alt => false;
  static fromChroma = chroma => false;

  static FROM = {
    name:       NAME.idName,
    midi:       NAME.fromMidi,
    frequency:  NAME.fromFreq,
    letter:     NAME.fromLetter,
    accidental: NAME.fromAcc,
    octave:     NAME.fromOct,
    pc:         NAME.fromPc,
    step:       NAME.fromStep,
    alteration: NAME.fromAlt,
    chroma:     NAME.fromChroma,
  };

  static FACTORY = curry((fromProp, withValue) => NAME.FROM[fromProp](withValue));
}

export const PROP_FACTORY_DICT = {
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

