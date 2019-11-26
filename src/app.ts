import { Note, NOTE } from '@packages/note';

const { Transpose, Distance, Compare } = NOTE;

const dmidi = Distance('midi');

console.log(dmidi({ name: 'A4' }, { name: 'C5' }));
