import { Note, NoteStatic } from '@packages/note/factories';

const C4 = Note({ name: 'C4' });
const D4 = Note({ name: 'D4' });

const toMidi = (n: NoteProps) => n.midi;
const makeArr = (...el) => Array.of(...el);

const add = (a: number, b: number) => a + b;
const addN = (n1: NoteProps, n2: NoteProps) => {
  const [a, b] = makeArr(n1, n2).map(toMidi);
  console.log(add(a, b));
};

addN(C4, D4);
