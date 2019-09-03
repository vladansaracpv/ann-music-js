type ScaleTypeName = string | PcChroma | PcNum;

type ScaleName = string;
type ScaleNameTokens = [string, string]; // [TONIC, SCALE TYPE]

interface ScaleType extends PcProperties {
  name: string;
  intervals: IvlName[];
  aliases: string[];
}

interface Scale extends ScaleType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}

interface Scale extends ScaleType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}

interface ScalePcset extends PcProperties {
  name: string;
  quality: ChordQuality;
  intervals: IvlName[];
  aliases: string[];
}
