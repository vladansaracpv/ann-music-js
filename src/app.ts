import { compose2 } from '@packages/base/functional';
import { Note, NoteStatic, Theory } from '@packages/note';

const a = Note('C3') as NoteProps;
const b = Note('C4') as NoteProps;
const c = Note('D4') as NoteProps;
const d = Note('D4') as NoteProps;
const notes = [a, b];

const g = (notes: NoteProps[], prop: NoteComparableProp = 'midi') => notes.map(n => n[prop]);

console.log(NoteStatic.cmp(b, c));
