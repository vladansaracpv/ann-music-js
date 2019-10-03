interface Tempo {
  value: number;
  unit: 'bpm';
}

interface TimeSignature {
  numerator: number;
  denominator: number;
}

type NotesType = 'r' | 'n' | 't';

interface PlayerNote {
  type: NotesType;
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
