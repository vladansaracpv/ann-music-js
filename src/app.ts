import { pcset } from '@packages/pc';
import { INTERVAL, Interval } from './packages/interval/index';
import { CHORD, Chord } from './packages/chord/index';
import { Scale, SCALE } from '@packages/scale';


// console.log(Scale('C major').chroma);
// console.log(Chord('C').chroma, Chord('C').num);
// console.log(Chord('Dm').chroma, Chord('Dm').num);
// console.log(Chord('Em').chroma, Chord('Em').num);
// console.log(Chord('F').chroma, Chord('F').num);

const cmajor = Scale('C major');
const dm = Chord('Dm');
const f = Chord('F');

console.log(SCALE.containsChord('C major', 'C5'))

// console.log(Chord('Am'));
// console.log(Interval(3));
// console.log(SCALE.scaleChords('C major').map(ch => Chord(ch)));
// console.log(SCALE.scaleChords('C major').map(ch => Chord(ch).aliases.join(' / ')));
// console.log(SCALE.scaleChords('C major').map(ch => Chord('C' + ch)).map(ch => ch.name + ': ' + ch.notes));
