import { compose2 } from '@packages/base/functional';
import { Note, NoteStatic, NoteMethods } from '@packages/note';

// const initMethods: NoteBuilderProps = { distance: false, transpose: false, compare: false };
const initMethods2: NoteBuilderProps = { compare: false, transpose: false, distance: false };
// const a = Note('C3');
const b = Note('C4');
// const c = Note('X4');

// console.log(a);
// console.log(b);
// console.log(c);

const a = NoteMethods('A4', initMethods2);
console.log(b);
console.log(a);
