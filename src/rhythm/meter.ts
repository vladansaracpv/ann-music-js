import { NoteValueType, NoteValueModel, NoteValueFactory } from './duration';

interface MeterType {
    top: number;
    bottom: number;
    type: string;
    unit: string;
    groups: number[];
    name: string;
}

type Meter = MeterType;

enum Meters {
    SIMPLE = 'simple',
    COMPOUND = 'compound',
    ODD = 'odd'
};


const GROUPS = ['-', '-', 'duple', 'triple', 'quadruple'];

const meterType = (beats: number): string => {
    if (beats < 5) return Meters.SIMPLE;
    if ([6, 9, 12].includes(beats)) return Meters.COMPOUND;
    return Meters.ODD;
}


const SimpleMeterFactory = (top: number, bottom: number): MeterType => {
    return Object.freeze({
        top,
        bottom,
        type: Meters.SIMPLE,
        unit: `${bottom}n`,
        groups: Array(top).fill(top / top),
        name: `${Meters.SIMPLE} ${GROUPS[top]}`,
    });
}

const CompoundMeterFactory = (top: number, bottom: number): MeterType => {
    const beats = top / 3;
    const groups = Array(beats).fill(top / beats);
    const type = Meters.COMPOUND;
    const unit = `${bottom / 2}n.`;
    const name = `${type} ${GROUPS[beats]}`;
    return Object.freeze({
        top,
        bottom,
        type,
        unit,
        groups,
        name,
    });
}

const OddMeterFactory = (top: number, bottom: number): MeterType => {

    const odd = (beats: number): number[] => {
        if (beats === 5) return [2, 3];

        return meterType(beats - 2) === Meters.ODD
            ? [2, ...odd(beats - 2)]
            : [...odd(beats - 3), 3];
    }

    return Object.freeze({
        top,
        bottom,
        type: Meters.ODD,
        unit: '',
        groups: odd(top),
        name: Meters.ODD,
    });
}

const MeterFactory = (top: number, bottom: number): MeterType => {
    const meter = meterType(top);
    if (meter === Meters.SIMPLE) return SimpleMeterFactory(top, bottom);
    if (meter === Meters.COMPOUND) return CompoundMeterFactory(top, bottom);
    return OddMeterFactory(top, bottom);
}

const makeCount = (level: number) => (beat: number) => {
    const marks = ['', '-', '-&-', '-e-&-a-']

    return `${beat}${marks[level]}`;
}

const countBeat = (top: number, bottom: number) => {
    return Array(top)
        .fill(0)
        .map((v, i) => (i + 1));
}

const sheet = (top: number, bottom: string, level: number) => {

    const { relative, kind, dots, short } = NoteValueModel(bottom);

    const _meter = countBeat(top, relative);

    const count = _meter.map(makeCount(level)).join('');
    const meter = _meter.map((v, i) => short + '-'.repeat(2 ** level - 1)).join('');

    return [meter, count];

}


const euclid = function (onNotes, totalNotes) {
    var groups = [];
    for (var i = 0; i < totalNotes; i++) groups.push([Number(i < onNotes)]);

    var l;
    while (l = groups.length - 1) {
        var start = 0, first = groups[0];
        while (start < l && compareArrays(first, groups[start])) start++;
        if (start === l) break;

        var end = l, last = groups[l];
        while (end > 0 && compareArrays(last, groups[end])) end--;
        if (end === 0) break;

        var count = Math.min(start, l - end);
        groups = groups
            .slice(0, count)
            .map(function (group, i) { return group.concat(groups[l - i]); })
            .concat(groups.slice(count, -count));
    }
    return [].concat.apply([], groups);
};

function compareArrays(a, b) {
    // TODO: optimize
    return JSON.stringify(a) === JSON.stringify(b);
};


export {
    Meter,
    MeterType,
    MeterFactory,
    countBeat,
    sheet
}
