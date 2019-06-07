/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

type IvlName = string;

type IvlNumber = number;

type IvlQuality = 'd' | 'm' | 'M' | 'P' | 'A';

type IvlAlteration = number;

type IvlStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type IvlDirection = -1 | 1;

type IvlType = 'M' | 'P';

type IvlSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type IvlSemitones = number;

type IvlChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type IvlOctave = number;

type IvlClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface IvlProps {
  name: IvlName;
  num: IvlNumber;
  quality: IvlQuality;
  alteration: IvlAlteration;
  step: IvlStep;
  direction: IvlDirection;
  type: IvlType;
  simple: IvlSimpleNumber;
  semitones: IvlSemitones;
  chroma: IvlChroma;
  octave: IvlOctave;
  ic: IvlClass;
}
