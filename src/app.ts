import { Accidental, Letter } from './packages/note/helpers';
import { Interval, INTERVAL } from '@packages/interval';
import { Note, NOTE } from '@packages/note';
import { Chord } from '@packages/chord';
import { Pc } from '@packages/pc';
import { Scale, SCALE } from '@packages/scale';
// const scales = NOTE.NOTES.map(note => Scale(note + ' major')).map(scale => scale.notes.join('-'));
// console.log(scales);

console.log(SCALE.reduced('C major'));
