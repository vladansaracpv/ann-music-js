import { Measure } from './rhytm/measure';
import { Metre } from './rhytm/metre';
import { Beat } from './rhytm/beat';

const time = Metre(4, 'q');
const b1 = Beat('e-e');
const b2 = Beat('q');
const b3 = Beat('e.-s');
const b4 = Beat('s-s-s-s');
const beats = [b1, b2, b3, b4];

const bar = Measure(beats, time);

console.log(bar);
console.log(bar.sheet(''));
