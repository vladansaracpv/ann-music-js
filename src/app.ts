import { INTERVAL, Interval } from './packages/interval/index';
import { CHORD, Chord } from './packages/chord/index';
import { Scale, SCALE } from '@packages/scale';

console.log(Chord('C'));
console.log(Chord('D'));
// console.log(Chord('Am'));
// console.log(Interval(3));
// console.log(Scale('C major').notes);
// console.log(SCALE.scaleChords('C major').map(ch => Chord(ch)));
// console.log(SCALE.scaleChords('C major').map(ch => Chord(ch).aliases.join(' / ')));
// console.log(SCALE.scaleChords('C major').map(ch => Chord('C' + ch)).map(ch => ch.name + ': ' + ch.notes));
