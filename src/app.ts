import { Note, NoteStatic } from '@packages/note/factories';
import { Interval, IntervalStatic } from '@packages/interval/factories';
import { toChroma, intervals, modes, isEqual, isNoteIncludedInSet, filterNotes, transpose } from '@packages/pc';

const isNoteInCMajor = isNoteIncludedInSet(['C', 'E', 'G']);

console.log(['C', 'D', 'E', 'F', 'G'].map(transpose('M3')));
