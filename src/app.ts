import { chordNotes, modeToChords, mode, scaleModes } from '@packages/mode';
import {
  Chord,
  chordScales,
  chordSuperset,
  chordSubset,
  chordType,
  chordFormula,
  entries,
  transposeByInterval,
} from '@packages/chord';
import { scale, scaleFormula, scaleChords, scaleToSteps } from '@packages/scale';
import { Interval } from '@packages/interval';
import { NOTE } from '@packages/note';

// console.log(entries().filter(entry => entry.length == 3));

console.log(chordFormula('Maj7'));
