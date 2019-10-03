import { Scale } from '@packages/scale';
import { Chord } from '@packages/chord';
import { Interval } from '@packages/interval';
import { Note, NoteStatic, NoteMethods } from '@packages/note';

const a = Note('A4');
const i = Interval({ name: 'P4' });
const c = Chord('Am');
const s = Scale('A blues');

console.log(a);
console.log(i);
console.log(c);
console.log(s);
