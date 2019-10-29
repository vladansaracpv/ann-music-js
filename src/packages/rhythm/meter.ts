/**
 *  2/8 - simple duple
 *  3/8 - simple triple
 *  4/8 - simple quadruple
 *  5/8 - odd
 *  6/8 - compound duple
 *  7/8 - odd
 *  8/8 - odd
 *  9/8 - compound triple
 * 10/8 - odd
 * 11/8 - odd
 * 12/8 - compound quadruple
 *
 * simple  : 2, 3, 4
 * compound: 6, 9, 12
 * odd     : 5, 7, 8, 10, 11
 */

interface TimeSignature {
  top: number;
  bottom: number;
}

type DurationValue = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 0;
type DurationType = 'n' | 'r' | 't' | 'd' | 'dd';
type DurationChar = 'w' | 'h' | 'q' | 'e' | 's' | 't' | 'ss';

interface Beat {
  duration: string;
  division: string;
}

interface MeterType {
  type: string;
  num: string;
  name: string;
}

const MeterTypes = {
  simple: ['duple', 'triple', 'quadruple'],
  compound: ['duple', 'triple', 'quadruple'],
  odd: ['5', '7', '8', '10', '11'],
};

const Meters = {
  simple: [2, 3, 4],
  compound: [6, 9, 12],
  odd: [5, 7, 8, 10, 11],
  duple: [2, 6],
  triple: [3, 9],
  quadruple: [4, 12],
};

const Validators = {
  isSimple: (ts: TimeSignature) => Meters.simple.includes(ts.top),
  isCompound: (ts: TimeSignature) => Meters.compound.includes(ts.top),
  isOdd: (ts: TimeSignature) => Meters.odd.includes(ts.top),
  isDuple: (ts: TimeSignature) => Meters.duple.includes(ts.top),
  isTriple: (ts: TimeSignature) => Meters.triple.includes(ts.top),
  isQuadruple: (ts: TimeSignature) => Meters.quadruple.includes(ts.top),
};

const meterType = (ts: TimeSignature) => {
  const { isSimple, isCompound } = Validators;
  return isSimple(ts) ? 'simple' : isCompound(ts) ? 'compound' : 'odd';
};

const meterNumber = (ts: TimeSignature) => {
  const { isDuple, isTriple, isQuadruple } = Validators;
  return isDuple(ts) ? 'duple' : isTriple(ts) ? 'triple' : isQuadruple(ts) ? 'quadruple' : '';
};

const meterName = (ts: TimeSignature) => {
  return meterType(ts) + ' ' + meterNumber(ts);
};

const Meter = (ts: TimeSignature): MeterType => {
  const type = meterType(ts);
  const num = meterNumber(ts);
  const name = meterName(ts);
  return { type, num, name };
};

const m = Meter({ top: 6, bottom: 8 });

const numToBeats = (ts: TimeSignature) => {};

console.log(m);

const Tempo = (bpm: number, value: string) => {};
