import { Note } from '@packages/note';
import { pcset, EmptySet } from '@packages/pc';
import { chord } from '@packages/chord';
import { scale } from '@packages/scale';

// 'C D E F G A'
//   .split(' ')
//   .map(tonic => chord(tonic))
//   .map(chord => console.log(chord.notes));

let n = Note.from({ name: 'G4' }, { comparison: false, transposition: false, distance: true, extension: true });
console.log(n.toChord('7'));
