interface Tempo {
  value: number;
  unit: 'bpm';
}

interface TimeSignature {
  numerator: number;
  denominator: number;
}

type NoteType = 'r' | 'n' | 't';

interface Note {
  type: NoteType;
  name: string;
  duration: string;
}

interface Measure {
  notes: Note[];
}

interface Sequence {
  measure: Measure;
  newTempo: Tempo;
  newTimeSignature: TimeSignature;
}
