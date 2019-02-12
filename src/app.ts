import { getNoteProps, simplify, midi, step } from './note/properties';
import { distance } from './note/distance';

const stepsFromC = distance(step, 'C4');
console.log(stepsFromC('B4'));
