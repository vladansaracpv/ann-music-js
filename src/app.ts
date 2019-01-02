import { Note } from './note';
import { compose } from './helpers';
import { chroma, midi, props } from './note/properties';
import { toBinary, isPc, toPcSet } from './pc/index';
import { WITH_SHARPS } from './note/theory';
import { callNTimes, shuffleBeat } from './beat';

const bar = ['q', 'q', 'q', 'q'];

console.log(callNTimes(shuffleBeat, bar, 2));
