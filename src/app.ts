import { Note } from '@packages/note';
import { pcset, EmptySet } from '@packages/pc';
import { chord } from '@packages/chord';
import { scale } from '@packages/scale';

// 'C D E F G A'
//   .split(' ')
//   .map(tonic => chord(tonic))
//   .map(chord => console.log(chord.notes));

console.log(Note.from({ frequency: 220 }));
