type ChordQuality = 'Major' | 'minor' | 'Augmented' | 'diminished' | 'Unknown' | 'other';

// export interface Pcset {
//   readonly num: number;
//   readonly chroma: PcsetChroma;
//   readonly normalized: PcsetChroma;
//   readonly length: number;
// }

// export interface ChordPcset extends Pcset {
//   name: string;
//   quality: ChordQuality;
//   intervals: IntervalName[];
//   aliases: string[];
// }

interface ChordPcset {
  name: string;
  quality: ChordQuality;
  intervals: IvlName[];
  aliases: string[];
}
