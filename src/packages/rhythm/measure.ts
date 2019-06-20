import { Meter, MeterType } from './meter';
import { Duration } from './duration';
export class Measure {
  private meter: Meter;
  private level: string; // counting level - in quarters, or eighths...
  private notes: string[];
  private bar: string;

  public constructor(meter: Meter, level?: string, notes?: string[]) {
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

  public properties = () => ({
    meter: this.meter.properties(),
    level: this.level,
    notes: this.notes,
    bar: this.bar,
  });
}
