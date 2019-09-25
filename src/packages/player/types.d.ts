interface Tempo {
  value: number;
  unit: 'bpm';
}

interface TimeSignature {
  numerator: number;
  denominator: number;
}

type NoteType = 'r' | 'n' | 't';

interface PlayerNote {
  type: NoteType;
  name: string;
  duration: string;
}

interface Measure {
  notes: PlayerNote[];
}

interface Sequence {
  measure: Measure;
  newTempo: Tempo;
  newTimeSignature: TimeSignature;
}
