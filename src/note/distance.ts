import { property } from './properties';
import { compose } from '../helpers';

const midi = property('midi');

export const distance = (a, b) => midi(b) - midi(a);

export const absoluteDistance = compose(Math.abs, distance);

// console.log(absoluteDistance('Gb4', 'G#4'));
