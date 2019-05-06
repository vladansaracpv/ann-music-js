
const isValid = (frequency: number): boolean => {
    return typeof frequency === 'number' && frequency > 0;
}

enum FrequencyError {
    INVALID_VALUE = 'Invalid frequency value. Expected: frequency > 0'
}

export class Frequency {

    private _value: number;

    private constructor(frequency: number) {
        this._value = frequency;
    }

    get value(): number {
        return this._value;
    }

    setFrequency(value: number): Frequency {
        if (!isValid(value)) throw Error(FrequencyError.INVALID_VALUE);
        this._value = value;
        return this;
    }

    detune(amount: number): Frequency {
        return this.setFrequency(this._value + amount);
    }

    properties() {
        return { frequency: this._value }
    }

    /**
     * Create instance from frequency value
     * 
     * @param frequency
     */
    static create = (frequency: number): Frequency => {
        if (!isValid(frequency)) throw Error(FrequencyError.INVALID_VALUE);
        return new Frequency(frequency);
    }

    /**
     * Create instance from MIDI key
     * 
     * @param {number} midi
     * 
     */
    static fromMidi = (midi: number, tuning = 440): Frequency => {
        if (midi < 0) return null;
        const frequency = 2 ** ((midi - 69) / 12) * tuning;

        return Frequency.create(frequency);
    }

}
