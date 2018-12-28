import { distance } from './distance';
import { Operators as Op } from './operators';
import { Properties, midi, frequency } from './properties';
import { Transpose } from './transpose';
import { compose } from '../helpers';
import { NOTE_PROP_FACTORY } from './factory';

export class Note {
  name: string;
  letter: string;
  step: number;
  accidental: string;
  alteration: number;
  octave: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;
  enharmonic: string;

  private constructor(name: string) {
    compose(
      Object.freeze,
      Object.assign
    )(
      this,
      { enharmonic: Properties.enharmonic(name) },
      Properties.props(name)
    );
  }

  static create(withValue: any, fromProp = 'name') {
    const name = NOTE_PROP_FACTORY('name', fromProp, withValue);
    if (!name) return undefined;
    return new Note(name);
  }

  distanceFrom = (n: Note, fn = midi) => distance(this.name, n.name, fn);

  gt = (other, f = midi) => Op.gt(this.name, other.name, f);
  geq = (other, f = midi) => Op.geq(this.name, other.name, f);
  eq = (other, f = midi) => Op.eq(this.name, other.name, f);
  lt = (other, f = midi) => Op.lt(this.name, other.name, f);
  leq = (other, f = midi) => Op.leq(this.name, other.name, f);
  inInterval = (a, b, f = midi) => Op.inInterval(a.name, b.name, this.name, f);
  inSegment = (a, b, f = midi) => Op.inSegment(a.name, b.name, this.name, f);

  transpose = (amount: string) => Transpose.transpose(this.name, amount);
  next = (n = 1) => Transpose.nextBy(this.name, n);
  prev = (n = 1) => Transpose.prevBy(this.name, n);
}
