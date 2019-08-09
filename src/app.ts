import { tokenize, scale, scaleChords, scaleNotes, extended, reduced, modeNames } from '@packages/scale';
import { Note } from '@packages/note';
import { Duration } from '@packages/rhythm/duration';

console.log(Duration({ note: '8r' }));
console.log(Duration({ value: 2, type: 't' }));

// console.log(chordType('major'));
