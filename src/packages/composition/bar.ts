interface Signature {
  top: number;
  bottom: number;
}

interface Tempo {
  bpm: number;
  note: number; // w: 1, h: 2, q: 4, ...
}

export class Bar {
  signature: Signature;
  tempo: Tempo;
  notes: string[];
}



