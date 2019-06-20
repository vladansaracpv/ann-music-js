import { Duration } from './duration';
import { Euclid } from './euclid';

export enum MeterType {
  Simple = 'simple',
  Compound = 'compound',
  Odd = 'odd',
}

export class Meter {
  private top: number;
  private bottom: number;
  private type: MeterType;
  private numOfBeats: number;
  private beat: string[];

  public getBeatValue = () =>
    this.type == MeterType.Compound ? Duration.valueToName(this.bottom).repeat(3) : this.beat.join(' ');
  public getNumOfBeats = () => this.numOfBeats;
  public getType = () => this.type;

  public constructor(top: number, bottom: number) {
    this.top = top;
    this.bottom = bottom;
    this.setType();
  }

  public properties = () => ({
    top: this.top,
    bottom: this.bottom,
    type: this.type,
    numOfBeats: this.numOfBeats,
    beat: this.beat,
  });

  private setType = () => {
    if (Meter.isCompound(this.top, this.bottom)) return this.createCompound();
    if (Meter.isSimple(this.top, this.bottom)) return this.createSimple();
    return this.createOdd();
  };

  public static isCompound = (top: number, bottom: number): boolean => {
    return top % 3 === 0 && top > 3;
  };

  public static isSimple = (top: number, bottom: number): boolean => {
    return top < 5;
  };

  private createSimple = () => {
    this.type = MeterType.Simple;
    this.numOfBeats = this.top;
    this.beat = [Duration.valueToName(this.bottom)];
  };

  private createCompound = () => {
    this.type = MeterType.Compound;
    this.numOfBeats = this.top / 3;
    this.beat = [Duration.valueToName(Duration.doubleValue(this.bottom)) + '.'];
  };

  private createOdd = () => {
    this.type = MeterType.Odd;
    this.numOfBeats = Math.ceil(this.top / 3);
    const name = Duration.valueToName(Duration.doubleValue(this.bottom));
    var arr: string = Euclid(this.numOfBeats, this.top, false).join('');
    arr = arr.replace(/100/g, name + '.').replace(/10/g, name + ' ');

    const groups = arr.split(' ').map(group => ((group[1] || ' ') === '.' ? [group[0], '.'] : [group, '']));

    this.beat = [arr];
  };
}
