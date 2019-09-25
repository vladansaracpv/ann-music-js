import { Note, NOTE } from '@packages/note';

const n = Note('B4') as NoteProps;
const o = Note(69) as NoteProps;
const p = Note(440.0) as NoteProps;

console.log(n, o, p);
