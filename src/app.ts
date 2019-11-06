import { NOTE, Note, NoteTransposableProp } from 'ann-music-note';
import { CHORD, Chord } from 'ann-music-chord';
import { Scale, SCALE } from 'ann-music-scale';

import { PC, PcProperties, PitchClass } from 'ann-music-pc';

const c = Chord('C major');
const d = Chord('D dominant seventh');
console.log(c);
console.log(d);

console.log(PitchClass.Methods.transpose('D3', '3M'));

// {"setNum":2192,"chroma":"100010010000","normalized":"100010010000","intervals":["1P","3M","5P"],"length":3,"empty":false,"type":"major","quality":"Major","aliases":["M",""],"tonic":"C","name":"C major","notes":["C","E","G"],"formula":"0-4-7","valid":true}
