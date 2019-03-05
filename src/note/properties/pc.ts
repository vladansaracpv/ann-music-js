
class Pc {
    pc: string;

    static PITCH_CLASSES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');
    static PC_SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');
    static PC_FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

    static isValid = (pc: string): boolean => {
        return Pc.PITCH_CLASSES.includes(pc);
    }

    static fromStringValue = (str: string): Pc => {
        const oct = str[str.length - 1];
        if (Number.isNaN(Number.parseInt(oct))) return Pc.fromPc(str);
        return Pc.fromName(str);
    }

    static fromPc = (pc: string): Pc => {
        return new Pc(pc);
    }

    static fromName = (name: string): Pc => {
        return new Pc(name);
    }

    static fromNumericValue = (num: number): Pc => {
        return num > 11
            ? Pc.fromMidi(num)
            : Pc.fromChroma(num);
    }

    static fromChroma = (chroma: number): Pc => {
        const pc = Pc.PC_FLATS[chroma];
        return new Pc(pc);
    }

    static fromMidi = (midi: number): Pc => {
        const chroma = midi % 12;
        return Pc.fromChroma(chroma);
    }

    static create = (property: number | string): Pc => {
        if (!['number', 'string'].includes(typeof property)) return null;
        return typeof property === 'string'
            ? Pc.fromStringValue(property)
            : Pc.fromNumericValue(property);

    }

    private constructor(pc: string) {
        if (!Pc.isValid(pc)) return null;
        this.pc = pc;
    }
}

console.log(Pc);
