import { parseInterval, NAMES } from './interval/theory';
import { fromName } from './interval/properties';

// console.log(makeInterval('-2m'));

NAMES.map(fromName).map(int => console.log(`${int.chroma}: ${int.semitones}: ${int.name} : ${int.ic}`));
