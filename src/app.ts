import { Note, NOTE } from '@packages/note';
import { lt } from './packages/base/relations';
import { compose2 } from '@packages/base/functional';

function toMidi(a: NoteProps, b: NoteProps) {
  var normalArray: NoteProps[] = Array.from(arguments);
  return normalArray.map(n => n.midi);
}

const id = n => n;
const convert = (a, b, fn: Function = id) => lt(fn(a), fn(b));

const a = Note('C4') as NoteProps;
const b = Note('D4') as NoteProps;

console.log(convert(2, 2));
