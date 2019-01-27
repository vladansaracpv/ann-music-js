import { props, enharmonic, midi } from './properties';
import { distance } from './distance';
import * as Op from './operators';
import * as Transpose from './transpose';
import { compose } from '../helpers';
import { NOTE_PROP_FACTORY } from './factories';

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

  private constructor(note_name: string) {
    compose(
      Object.freeze,
      Object.assign
    )(this, {
      ...props(note_name),
      enharmonic: enharmonic(note_name)
    });
  }

  static create(withValue: any, fromProp = 'name') {
    const name = NOTE_PROP_FACTORY('name', fromProp, withValue);
    if (!name) return undefined;
    return new Note(name);
  }

  /* Distance between two notes */
  distanceFrom = (n: Note, fn = midi) => distance(this.name, n.name, fn);

  /* Equality operators */
  higher = (other, f = midi) => Op.higher(this.name, other.name, f);
  lower = (other, f = midi) => Op.lower(this.name, other.name, f);
  higherThan = (other, f = midi) => Op.higherThan(this.name, other.name, f);
  higherEq = (other, f = midi) => Op.higherEq(this.name, other.name, f);
  equal = (other, f = midi) => Op.equal(this.name, other.name, f);
  lowerThan = (other, f = midi) => Op.lowerThan(this.name, other.name, f);
  lowerEq = (other, f = midi) => Op.lowerEq(this.name, other.name, f);
  inInterval = (a, b, f = midi) => Op.inInterval(a.name, b.name, this.name, f);
  inSegment = (a, b, f = midi) => Op.inSegment(a.name, b.name, this.name, f);

  /* Transpose */
  transpose = (amount: string) => Transpose.transpose(this.name, amount);
  next = (n = 1) => Transpose.nextBy(this.name, n);
  prev = (n = 1) => Transpose.prevBy(this.name, n);
}
