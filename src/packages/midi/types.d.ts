interface TTempo {
  value: number;
  unit: 'bpm';
}

interface TTimeSignature {
  numerator: number;
  denominator: number;
}

type NoteType = 'r' | 'n' | 't';

interface Note {
  type: NoteType;
  name?: string;
  duration: string;
}

interface Measure {
  notes: Note[];
}

interface Sequence {
  measure?: Measure;
  newTempo: TTempo;
  newTimeSignature: TTimeSignature;
}
