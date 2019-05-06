export class MidiTheory {
    static isValid = (midi: number): boolean => {
        return Number.isInteger(midi);
    }

    static toOctave = (midi: number): number => {
        if (!MidiTheory.isValid(midi)) return null;
        return Math.floor(midi / 12) - 1;
    }

    static toFrequency = (midi: number, tuning = 440): number => {
        if (!MidiTheory.isValid(midi)) return null;
        return 2 ** ((midi - 69) / 12) * tuning;
    }

    static toChroma = (midi: number): number => {
        if (!MidiTheory.isValid(midi)) return null;
        return midi % 12;
    }
}

export class Midi extends MidiTheory {
    value: number;

    /**
     * Create Midi object from {number} midi value
     * 
     * @param {number} midi
     * 
     */
    static fromMidi = (midi: number): Midi => {
        if (!Midi.isValid(midi)) return null;
        return new Midi(midi);
    }

    /**
     * Create Midi object from {number} freq value
     * 
     * @param {number} freq
     * @param {number} [tuning=440]
     * 
     */
    static fromFreq = (freq: number, tuning: number = 440.0): Midi => {
        const midi = Math.ceil(12 * Math.log2(freq / tuning) + 69);
        if (!Midi.isValid(midi)) return null;
        return new Midi(midi);
    }

    /**
     * Create Midi object from {string} or {number} value
     * 
     * @param {number} property
     * @param {boolean} [isMidi=true]
     * 
     */
    static create = (property: number, isMidi: boolean = true): Midi => {
        if (typeof property !== 'number') return null;
        return isMidi
            ? Midi.fromMidi(property)
            : Midi.fromFreq(property);
    }

    private constructor(midi: number) {
        super();
        this.value = midi;
    }

    toValue = (): number => this.value;
    toOctave = (): number => Midi.toOctave(this.value);
    toFrequency = (tuning = 440): number => Midi.toFrequency(this.value, tuning);
    toChroma = (): number => Midi.toChroma(this.value);
}

// name: string;
// letter: string;
// step: number;
// accidental: string;
// alteration: number;
// pc: string;

