import { Chord } from '@packages/chord';
import { Interval, INTERVAL, IntervalBuilder } from '@packages/interval';
import { Note, NOTE, NoteBuilder } from '@packages/note';
import { Scale } from '@packages/scale';

// const a = Note('A4');
// const i = Interval({ name: 'P4' });
// const c = Chord('Am');
// const s = Scale('A blues');

// console.log(a);
// console.log(i);
// console.log(c);
// console.log(s);

console.log(Interval(['A4', 'C5']));
