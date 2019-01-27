import * as distance from './distance';
import * as interval from './interval/theory';

// const ivl = 'M3';
// console.log('Interval: ', interval.props(ivl));
console.log(`Encode ${'F3'}: ${distance.encodeNote('F3')}`);

// console.log(interval.NAMES.map(distance.encodeIvl));

console.log(distance.FIFTH_OCTS);
