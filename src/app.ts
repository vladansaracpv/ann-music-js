import { chordNotes, modeToChords, mode, entries } from '@packages/mode';
import { chord, chordScales, extended, reduced, chordType, chordFormula } from '@packages/chord';
import { scale, scaleFormula, scaleChords, scaleToSteps } from '@packages/scale';
import { Interval } from '@packages/interval';
import { NOTE } from '@packages/note';
import { transpose } from '@packages/pc';

// console.log(chordNotes('C4', 'M', 3));

// console.log(modeToChords('aeolian', 'A4'));

// console.log(scaleFormula('major'));

console.log(scaleToSteps('whole tone'));
