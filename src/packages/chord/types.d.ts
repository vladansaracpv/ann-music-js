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

type ChordType = string | PcsetChroma | PcsetNum;

interface ChordPcset extends PcProps {
  name: string;
  quality: ChordQuality;
  intervals: IvlName[];
  aliases: string[];
}
