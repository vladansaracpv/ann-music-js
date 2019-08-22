import { Note } from '@packages/note';
import { pcset, EmptySet } from '@packages/pc';
import { chord } from '@packages/chord';
import { scale } from '@packages/scale';
import { NoteMethodsBuilder } from '@packages/note/builder';

// 'C D E F G A'
//   .split(' ')
//   .map(tonic => chord(tonic))
//   .map(chord => console.log(chord.notes));

const builder = NoteMethodsBuilder();

const note = {
  ...builder.createDistanceMethods(),
  ...builder.createExtensionMethods(),
  ...builder.createTransposeMethods(),
};

console.log(note);
