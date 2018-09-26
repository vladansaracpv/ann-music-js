import { Theory } from './theory';
import { Distance } from './distance';
import { Operators } from './operators';
import { Properties, midi, frequency } from './properties';
import { Transpose } from './transpose';

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
    const props = Properties.props(name);
    Object.assign(this, props);
    Object.freeze(this);
  }

  distanceFrom(n: Note, fn = midi) {
    return Distance.distance(this.name, n.name, fn);
  }

}

const c = new Note('C#4');
const d = new Note('A#4');
console.log(c.distanceFrom(d));


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
