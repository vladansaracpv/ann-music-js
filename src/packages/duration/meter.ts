type TSTop = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type TSBottom = 2 | 4 | 8 | 16;

interface TS {
  top: TSTop;
  bottom: TSBottom;
}

type BeatGroup = 'duple' | 'triple' | 'quadruple';
type BeatDivision = 'simple' | 'compound';

const compareArrays = (a, b) => {
  // TODO: optimize
  return JSON.stringify(a) === JSON.stringify(b);
};

const euclid = function(onNotes, totalNotes) {
  var groups = [];
  for (var i = 0; i < totalNotes; i++) groups.push([Number(i < onNotes)]);

  var l;
  while ((l = groups.length - 1)) {
    var start = 0,
      first = groups[0];
    while (start < l && compareArrays(first, groups[start])) start++;
    if (start === l) break;

    var end = l,
      last = groups[l];
    while (end > 0 && compareArrays(last, groups[end])) end--;
    if (end === 0) break;

    var count = Math.min(start, l - end);
    groups = groups
      .slice(0, count)
      .map(function(group, i) {
        return group.concat(groups[l - i]);
      })
      .concat(groups.slice(count, -count));
  }
  return [].concat.apply([], groups);
};

export class TimeSignature {
  private top: TSTop;
  private bottom: TSBottom;
  private grouping: BeatGroup;
  private division: BeatDivision;

  public constructor(top: TSTop, bottom: TSBottom) {
    this.top = top;
    this.bottom = bottom;
    this.setMeter();
  }

  private setMeter = () => {
    this.setGrouping();
    this.setDivision();
  };

  public setGrouping = () => {
    switch (this.top) {
      case 2:
        this.grouping = 'duple';
        break;
      case 3:
        this.grouping = 'triple';
        break;
      case 4:
        this.grouping = 'quadruple';
        break;

      default:
        break;
    }
  };

  public setDivision = () => {
    if (this.top <= 4) this.division = 'simple';
    if (this.top >= 6 && this.top % 3 === 0) this.division = 'compound';
  };

  public getMeterType = () => `${this.division} ${this.grouping}`;
}
