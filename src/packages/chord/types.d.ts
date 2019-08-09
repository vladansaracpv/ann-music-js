type ChordQuality = 'Major' | 'Minor' | 'Augmented' | 'Diminished' | 'Unknown' | 'Other';

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

interface ChordPcset extends PcProperties {
  name: string;
  quality: ChordQuality;
  intervals: IvlName[];
  aliases: string[];
}

type ChordTypeName = string | PcChroma | PcNum;

type ChordName = string;
type ChordNameTokens = [string, string];
