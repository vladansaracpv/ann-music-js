import { getNoteProps, simplify, midi, step, chroma, frequency } from './note/properties';
import { distance } from './note/distance';

const stepsFromA = distance('A4', 'D4');
console.log('fn: ', stepsFromA(midi));
