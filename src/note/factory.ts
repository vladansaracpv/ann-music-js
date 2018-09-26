import { Theory as T } from './theory';
import { compose, curry, firstLetter, and, or, withTick } from '../helpers';
import { name, midi, octave, chroma, frequency } from './properties';
import { FactoryError as ERROR } from '../error';

const dict = ERROR.errorDict;

export class LETTER {
  static fromLetter = letter => letter;
  static fromName = name => firstLetter(name);
  static fromPc = pc => firstLetter(pc);
  static fromChroma = chroma => compose(LETTER.fromPc, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => LETTER.fromChroma(midi % 12);
  static fromFreq = freq => compose(LETTER.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromStep = step => T.LETTERS[step];
  static fromAcc = acc => ERROR.NO_FACT_FOR_PARAM('letter', 'accidental', acc);
  static fromAlt = alt => ERROR.NO_FACT_FOR_PARAM('letter', 'alteration', alt);
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('letter', 'octave', oct);

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
  static fromName = name => compose(STEP.fromLetter, firstLetter)(name);
  static fromPc = pc => compose(STEP.fromLetter, firstLetter)(pc);
  static fromChroma = chroma => compose(STEP.fromPc, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => STEP.fromChroma(midi % 12);
  static fromFreq = freq => compose(STEP.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromStep = step => T.LETTERS[step];
  static fromAcc = acc => ERROR.NO_FACT_FOR_PARAM('step', 'accidental', acc);
  static fromAlt = alt => ERROR.NO_FACT_FOR_PARAM('step', 'alteration', alt);
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('step', 'octave', oct);

  static FROM = {
    letter:     STEP.fromLetter,
    name:       STEP.fromName,
    pc:         STEP.fromPc,
    step:       STEP.fromStep,
    chroma:     STEP.fromChroma,
    midi:       STEP.fromMidi,
    frequency:  STEP.fromFreq,
    accidental: STEP.fromAcc,
    alteration: STEP.fromAlt,
    octave:     STEP.fromOct
  };

  static FACTORY = curry((fromProp, withValue) => STEP.FROM[fromProp](withValue));
}

export class ACCIDENTAL {
  static fromName = name => name.length === 1 ? '' : name.substring(1);
  static fromAccidental = acc => acc;
  static fromPc = pc => ACCIDENTAL.fromName(pc);
  static fromAlt = alt => alt < 0 ? 'b'.repeat(alt) : '#'.repeat(alt);
  static fromChroma = chroma => compose(ACCIDENTAL.fromName, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => compose(ACCIDENTAL.fromPc, PC.FACTORY('midi'))(midi);
  static fromFreq = freq => compose(ACCIDENTAL.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => ERROR.NO_FACT_FOR_PARAM('accidental', 'letter', letter);
  static fromStep = step => ERROR.NO_FACT_FOR_PARAM('accidental', 'step', step);
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('accidental', 'octave', oct);

  static FROM = {
    accidental: ACCIDENTAL.fromAccidental,
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
  static fromName = name => name.length === 1 ? 0 : ALTERATION.fromAccidental(name.substring(1));
  static fromPc = pc => ALTERATION.fromName(pc);
  static fromAlt = alt => alt;
  static fromChroma = chroma => compose(ALTERATION.fromName, PC.FACTORY('chroma'))(chroma);
  static fromMidi = midi => compose(ALTERATION.fromPc, PC.FACTORY('midi'))(midi);
  static fromFreq = freq => compose(ALTERATION.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => ERROR.NO_FACT_FOR_PARAM('alteration', 'letter', letter);
  static fromStep = step => ERROR.NO_FACT_FOR_PARAM('alteration', 'step', step);
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('alteration', 'octave', oct);

  static FROM = {
    accidental: ALTERATION.fromAccidental,
    name:       ALTERATION.fromName,
    pc:         ALTERATION.fromPc,
    alteration: ALTERATION.fromAlt,
    chroma:     ALTERATION.fromChroma,
    midi:       ALTERATION.fromMidi,
    frequency:  ALTERATION.fromFreq,
    letter:     ALTERATION.fromLetter,
    step:       ALTERATION.fromStep,
    octave:     ALTERATION.fromOct,
  };

  static FACTORY = curry((fromProp, withValue) => ALTERATION.FROM[fromProp](withValue));
}

export class PC {
  static fromName = name => name(name);
  static fromPc = pc => pc;
  static fromChroma = chroma => T.SHARPS[chroma];
  static fromMidi = midi => PC.fromChroma(midi % 12);
  static fromFreq = freq => compose(PC.fromMidi, MIDI.FACTORY('freq'));
  static fromLetter = letter => ERROR.NEED_MORE_ARGS('pc', 'letter', letter, or(['accidental', 'alteration']));
  static fromStep = step => ERROR.NEED_MORE_ARGS('pc', 'step', step, or(['accidental', 'alteration']));
  static fromAcc = acc => ERROR.NEED_MORE_ARGS('pc', 'octave', acc, or(['letter', 'step']));
  static fromAlt = alt => ERROR.NEED_MORE_ARGS('pc', 'octave', alt, or(['letter', 'step']));
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('pc', 'octave', oct);

  static FROM = {
    pc:         PC.fromPc,
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
  static fromName = name => chroma(name);
  static fromChroma = chroma => chroma;
  static fromMidi = midi => CHROMA.fromChroma(midi % 12);
  static fromFreq = freq => compose(CHROMA.fromMidi, MIDI.FACTORY('freq'));
  static fromLetter = letter => ERROR.NEED_MORE_ARGS('chroma', 'letter', letter, or(['accidental', 'alteration']));
  static fromStep = step => ERROR.NEED_MORE_ARGS('chroma', 'step', step, or(['accidental', 'alteration']));
  static fromAcc = acc => ERROR.NEED_MORE_ARGS('chroma', 'octave', acc, or(['letter', 'step']));
  static fromAlt = alt => ERROR.NEED_MORE_ARGS('chroma', 'octave', alt, or(['letter', 'step']));
  static fromOct = oct => ERROR.NO_FACT_FOR_PARAM('chroma', 'octave', oct);

  static FROM = {
    pc:         CHROMA.fromPc,
    name:       CHROMA.fromName,
    chroma:     CHROMA.fromChroma,
    midi:       CHROMA.fromMidi,
    frequency:  CHROMA.fromFreq,
    letter:     CHROMA.fromLetter,
    step:       CHROMA.fromStep,
    accidental: CHROMA.fromAcc,
    alteration: CHROMA.fromAlt,
    octave:     CHROMA.fromOct
  };

  static FACTORY = curry((fromProp, withValue) => PC.FROM[fromProp](withValue));
}

export class MIDI {
  static fromName = name => midi(name);
  static fromMidi = midi => midi;
  static fromFreq = (freq, tuning = 440) => {
    return Math.ceil(12 * Math.log2(freq / tuning) + 69);
  };

  static fromLetter = letter => ERROR.NEED_MORE_ARGS('midi', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromStep = step => ERROR.NEED_MORE_ARGS('midi', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromAccidental = acc => ERROR.NEED_MORE_ARGS('midi', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true));
  static fromAlteration = alt => ERROR.NEED_MORE_ARGS('midi', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true));
  static fromPc = pc => ERROR.NEED_MORE_ARGS('midi', 'pc', pc, and(['octave']));
  static fromChroma = chroma => ERROR.NEED_MORE_ARGS('midi', 'chroma', chroma, and(['octave']));
  static fromOctave = oct => ERROR.NEED_MORE_ARGS('midi', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true));

  static FROM = {
    midi:       MIDI.fromMidi,
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

  static fromName = name => frequency(name);
  static fromFreq = (freq, tuning = 440) => freq;
  static fromLetter = letter => ERROR.NEED_MORE_ARGS('frequency', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromStep = step => ERROR.NEED_MORE_ARGS('frequency', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromAccidental = acc => ERROR.NEED_MORE_ARGS('frequency', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true));
  static fromAlteration = alt => ERROR.NEED_MORE_ARGS('frequency', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true));
  static fromPc = pc => ERROR.NEED_MORE_ARGS('frequency', 'pc', pc, and(['octave']));
  static fromChroma = chroma => ERROR.NEED_MORE_ARGS('frequency', 'chroma', chroma, and(['octave']));
  static fromOctave = oct => ERROR.NEED_MORE_ARGS('frequency', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true));

  static FROM = {
    midi:       FREQUENCY.fromMidi,
    frequency:  FREQUENCY.fromFreq,
    name:       FREQUENCY.fromName,
    letter:     FREQUENCY.fromLetter,
    step:       FREQUENCY.fromStep,
    accidental: FREQUENCY.fromAccidental,
    alteration: FREQUENCY.fromAlteration,
    pc:         FREQUENCY.fromPc,
    chroma:     FREQUENCY.fromChroma,
    octave:     FREQUENCY.fromOctave
  };

  static FACTORY = curry((fromProp, withValue) => FREQUENCY.FROM[fromProp](withValue));
}

export class OCTAVE {
  static fromName = name => octave(name);
  static fromOctave = octave => octave;
  static fromMidi = midi => Math.floor(midi / 12) - 1;
  static fromFreq = freq => compose(OCTAVE.fromMidi, MIDI.FACTORY('freq'))(freq);
  static fromLetter = letter => ERROR.NO_FACT_FOR_PARAM('octave', 'letter', letter);
  static fromAcc = acc => ERROR.NO_FACT_FOR_PARAM('octave', 'accidental', acc);
  static fromPc = pc => ERROR.NO_FACT_FOR_PARAM('octave', 'pc', pc);
  static fromStep = step => ERROR.NO_FACT_FOR_PARAM('octave', 'step', step);
  static fromAlt = alt => ERROR.NO_FACT_FOR_PARAM('octave', 'alteration', alt);
  static fromChroma = chroma => ERROR.NO_FACT_FOR_PARAM('octave', 'chroma', chroma);

  static FROM = {
    octave:     OCTAVE.fromOctave,
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
  static fromName = name => name;
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
    name:       NAME.fromName,
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

const NOTE_PROP_FACTORY_DICT = {
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

export const NOTE_PROP_FACTORY = curry((whatProp, fromProp, withValue) => {
  return NOTE_PROP_FACTORY_DICT[whatProp](fromProp, withValue);
});

