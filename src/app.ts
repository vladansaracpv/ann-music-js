import { createIntervalFromSemitones, createIntervalFromNotes } from './packages/interval/properties';
import { DurationProps, Duration } from './packages/rhythm/duration';

const n16 = Duration('16:p');
const n8 = n16.double();

console.log(n16.props);
console.log(n8);
