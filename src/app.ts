import { NoteBuilder, Note, NOTE } from '@packages/note/factories';

const note = NoteBuilder({ distance: true, transpose: true, compare: true }, { name: 'C4' });
const C5 = Note({ name: 'C5' });
const A5 = Note({ name: 'A5' });

console.log(note.lt(A5, 'chroma'));
console.log(NOTE.eq(C5, A5, 'octave'));
