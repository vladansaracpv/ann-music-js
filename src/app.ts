import { Note, NoteStatic } from '@packages/note/factories';
import { NoteBinRelations } from '@packages/note/mixins';

const C4 = Note({ name: 'C4' });
const D4 = Note({ name: 'D4' });

// console.log(C4.op.gt(D4));

console.log(NoteStatic.op.leq(C4, D4));
