import { Note, NOTE, note } from '@packages/note';

const n = note('A4');
const n2 = Note({ name: 'A#4' });

console.log(n);
console.log(n2);
