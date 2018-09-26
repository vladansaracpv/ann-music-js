import { Theory } from './theory';
import { Distance } from './distance';
import { Operators } from './operators';
import { Properties, midi, frequency } from './properties';
import { Transpose } from './transpose';
import { compose } from '../helpers';

export class Note {

  name: string;
  octave: number;
  letter: string;
  step: number;
  accidental: string;
  alteration: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;

  constructor(name: string, from = 'name') {
    compose(Object.freeze, Object.assign)(this, Properties.props(name));
  }

  distanceFrom = (n: Note, fn = midi) => Distance.distance(this.name, n.name, fn);

  gt = (other, f = midi) => Operators.gt(this.name, other.name, f);

  geq = (other, f = midi) => Operators.geq(this.name, other.name, f);
    ​
  eq = (other, f = midi) => Operators.eq(this.name, other.name, f);
    ​
  lt = (other, f = midi) => Operators.lt(this.name, other.name, f);
    ​
  leq = (other, f = midi) => Operators.leq(this.name, other.name, f);

  inInterval = (a, b, f = midi) => Operators.inInterval(a.name, b.name, this.name, f);
    ​
  inSegment = (a, b, f = midi) => Operators.inSegment(a.name, b.name, this.name, f);

  enharmonic = () => Properties.enharmonic(this.name);

}

const c = new Note('C#4');
const d = new Note('D#4');
const e = new Note('E#4');
console.log(d.enharmonic());


  // private createNote(key: any, value): Note {
  //   const note = key === 'name' ? new Note(value) : new Note(this.name);
  //   note[key] = value;
  //   return note;
  // }

  // Name
  // get name(): string { return this._name; }
  // set name(name: string) { this.createNote('_name', name); }

  // Octave
  // get octave(): number { return this._octave; }
  // set octave(octave: number) { this.createNote('_octave', octave); }

  // Letter
  // get letter(): string { return this._letter; }
  // set letter(letter: string) { this.createNote('_letter', letter); }

  // Step
  // get alteration(): number { return this._alteration; }
  // set alteration(alteration: number) { this.createNote('_alteration', alteration); }

  // Accidental
  // get accidental(): string { return this._accidental; }
  // set accidental(accidental: string) { this.createNote('_accidental', accidental); }

  // Alteration
  // get step(): number { return this._step; }
  // set step(step: number) { this.createNote('_step', step); }

  // PC
  // get pc(): string { return this._pc; }
  // set pc(pc: string) { this.createNote('_pc', pc); }

  // Chroma
  // get chroma(): number { return this._chroma; }
  // set chroma(chroma: number) { this.createNote('_chroma', chroma); }

  // Midi
  // get midi(): number { return this._midi; }
  // set midi(midi: number) { this.createNote('_midi', midi); }

  // Frequency
  // get frequency(): number { return this._frequency; }
  // set frequency(frequency: number) { this.createNote('_frequency', frequency); }
