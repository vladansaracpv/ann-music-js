import { Note, NOTE } from '@packages/note';

const n = Note({ name: 'B4' }) as NoteProps;
const o = Note({ name: 'G4' }) as NoteProps;

const a4 = NOTE.withMethods({ transpose: true, compare: false, distance: true }, { name: 'A4' });
console.log(a4.distance(n));
