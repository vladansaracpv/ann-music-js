import { LETTERS } from '../theory';
import { compose, curry, charAt, isEither, rest, glue } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { isStep } from '../validator';
import { PC } from '../factories/pc';
import { MIDI } from '../factories/midi';



const STEP = {
  fromLetter: letter => LETTERS.indexOf(letter),
  fromStep: step => LETTERS[step],
  fromName: name => compose(STEP.fromLetter, charAt(0))(name),
  fromPc: pc => compose(STEP.fromLetter, charAt(0))(pc),
  fromChroma: chroma => compose(STEP.fromPc, PC.fromChroma)(chroma),
  fromFreq: freq => compose(STEP.fromMidi, MIDI.fromFreq)(freq),
  fromMidi: midi => STEP.fromChroma(midi % 12),
  fromAcc: acc => ERROR.NO_FACTORY('step', 'accidental', acc),
  fromAlt: alt => ERROR.NO_FACTORY('step', 'alteration', alt),
  fromOct: oct => ERROR.NO_FACTORY('step', 'octave', oct)
};


export const STEP_FACTORY = ({ fromProperty, withValue }) => {
  const step = STEP[fromProperty](withValue);

  return isEither(
    step,
    undefined,
    isStep(step)
  );
};
