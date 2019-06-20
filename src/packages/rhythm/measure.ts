import { Meter, MeterType } from './meter';
import { Duration } from './duration';
export class Measure {
  meter: Meter;
  level: string; // counting level - in quarters, or eighths...
  notes: string[];
  bar: string;

  constructor(meter: Meter, level?: string, notes?: string[]) {
    this.meter = meter;
    const beat = this.meter.getBeatValue();
    this.level = level || beat;
    this.notes = notes
      ? notes
      : this.meter.getType() === MeterType.Odd
      ? beat.split(' ')
      : Array(this.meter.getNumOfBeats()).fill(beat);
    this.bar =
      this.meter.getType() === MeterType.Odd
        ? ''
        : this.notes.map(note => Duration.toDurationN(note, this.level)).join(' ');
  }

  properties = () => ({
    meter: this.meter.properties(),
    level: this.level,
    notes: this.notes,
    bar: this.bar,
  });
}
