import { Note, NoteStatic, transpose } from '@packages/note/factories';
import { NoteRelations, withDistance } from '@packages/note/mixins';

const C4 = Note({ name: 'C4' });
const D4 = Note({ name: 'D4' });

console.log(C4.distanceTo(D4));
