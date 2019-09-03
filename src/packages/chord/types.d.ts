type ChordQuality = 'Major' | 'Minor' | 'Augmented' | 'Diminished' | 'Unknown' | 'Other';

// type: ChordTypeName = 'm' | '100100010000' | 2320
type ChordTypeName = string | PcChroma | PcNum;

// name: ChordName = 'm' | 'Cm'
type ChordName = string;

type ChordNameTokens = [NoteName, ChordTypeName];

// interface PcProperties {
//   empty: boolean;
//   num: number;
//   chroma: PcChroma;
//   normalized: PcChroma;
//   length?: number;
// }
interface ChordType extends PcProperties {
  name: string;
  quality: ChordQuality;
  intervals: IvlName[];
  aliases: string[];
}

interface Chord extends ChordType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}
// interface Chord {
//   empty: boolean;
//   num: number;
//   chroma: PcChroma;
//   normalized: PcChroma;
//   length?: number;
//   name: string;
//   quality: ChordQuality;
//   intervals: IvlName[];
//   aliases: string[];
//   tonic: string | null;
//   type: string;
//   notes: NoteName[];
// }
