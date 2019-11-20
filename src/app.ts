import { NOTE, Note } from '@packages/note';
import { CHORD, Chord } from 'ann-music-chord';
import { Interval } from '@packages/interval';
import { Scale, SCALE, scaleNotes } from '@packages/scale';

import { PC, PcProperties, PitchClass } from 'ann-music-pc';

const note = Note({ name: 'A#4' });
console.log(note);
