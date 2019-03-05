
export class Midi {
    value: number;

    static isValid = (midi: number): boolean => {
        return Number.isInteger(midi);
    }

    static fromMidi = (midi: number): Midi => {
        return new Midi(midi);
    }

    static fromFreq = (freq: number, tuning = 440.0): Midi => {
        const midi = Math.ceil(12 * Math.log2(freq / tuning) + 69);
        return new Midi(midi);
    }

    static create = (property: number, isMidi = true): Midi => {
        if (typeof property !== 'number') return null;
        return isMidi
            ? Midi.fromMidi(property)
            : Midi.fromFreq(property);
    }

    private constructor(midi: number) {
        if (!Midi.isValid(midi)) return null;
        this.value = midi;
    }
}

