import { curry } from '../../helpers';
import { NAME_FACTORY } from './name';
import { LETTER_FACTORY } from './letter';
import { ACCIDENTAL_FACTORY } from './accidental';
import { OCTAVE_FACTORY } from './octave';
import { PC_FACTORY } from './pc';
import { STEP_FACTORY } from './step';
import { ALTERATION_FACTORY } from './alteration';
import { CHROMA_FACTORY } from './chroma';
import { MIDI_FACTORY } from './midi';
import { FREQUENCY_FACTORY } from './frequency';

const NOTE_PROP_FACTORY_DICT = {
  name:       NAME_FACTORY,
  letter:     LETTER_FACTORY,
  accidental: ACCIDENTAL_FACTORY,
  octave:     OCTAVE_FACTORY,
  pc:         PC_FACTORY,
  step:       STEP_FACTORY,
  alteration: ALTERATION_FACTORY,
  chroma:     CHROMA_FACTORY,
  midi:       MIDI_FACTORY,
  frequency:  FREQUENCY_FACTORY
};

export const NOTE_PROP_FACTORY = curry((newProp, fromProp, withValue) => {
  return NOTE_PROP_FACTORY_DICT[newProp](fromProp, withValue);
});
