
class Name {
    name: string;

    //   static fromMidi = (midi, useSharps = true) => {
    //     const CHROMA = Math.round(midi) % 12;
    //     const oct = Math.round(midi) / 12;
    //     const pc = isEither(WITH_SHARPS[CHROMA], WITH_FLATS[CHROMA], useSharps);
    //     const octave = Math.floor(oct) - 1;
    //     return pc + octave;
    //   };
    //   static fromName = name => name;
    //   static fromFreq = freq => compose(NAME.fromMidi, MIDI.fromFreq)(freq);

    static isValid = (name: string): boolean => {
        return true;
    }

    static create = (name: string): Name => {
        return new Name(name);
    }

    private constructor(name: string) {
        if (!Name.isValid(name)) return null;
        this.name = name;
    }
}
