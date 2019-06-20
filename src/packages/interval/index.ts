import * as Theory from './theory';
import { Factory } from './factories';
import * as Properties from './properties';

export { Theory, Factory, Properties };

// const INTERVAL_QUALITIES = {
//   d: { long: 'diminished', short: 'd', abbr: '°' },
//   m: { long: 'minor', short: 'm', abbr: 'm' },
//   M: { long: 'Major', short: 'M', abbr: 'M' },
//   P: { long: 'Perfect', short: 'P', abbr: 'P' },
//   A: { long: 'Augmented', short: 'A', abbr: '+' },
// };

/**
  +----+----+----+----+----+----+----+----+----+----+----+----+----+
  | 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | C  | C# | D  | D# | E  | F  | F# | G  | G# | A  | A# | B  | C  |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | P1 | A1 | M2 | A2 | M3 | P4 | A4 | P5 | A5 | M6 | A6 | M7 | P8 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | C  | Db | D  | Eb | E  | F  | Gb | G  | Ab | A  | Bb | B  | C  |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | P1 | m2 | M2 | m3 | M3 | P4 | d5 | P5 | m6 | M6 | m7 | M7 | P8 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | d2 | A1 | d3 | A2 | d4 | A3 |d5A4| d6 | A5 | d7 | A6 | d8 | A7 |
  +----+----+----+----+----+----+----+----+----+----+----+----|----+
*/
