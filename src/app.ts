import { Note, NoteStatic } from '@packages/note/factories';
import { Interval, IntervalStatic } from '@packages/interval/factories';
import { toChroma, intervals, modes, isEqual, isNoteIncludedInSet, filterNotes } from '@packages/pc';
import { chordType, entries } from '@packages/chord/dictionary';
import { tokenize, chord, transpose, chordScales, extended, reduced } from '@packages/chord';

console.log(extended('CMaj7'));
console.log(reduced('Cmaj9'));
console.log(reduced('maj9'));

// console.log(chordType('major'));
