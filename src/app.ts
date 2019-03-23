import { isValidMeasure, MeasureFactory } from './rhythm/measure';
import { Meter, MeterFactory, countBeat, sheet } from './rhythm/meter';
import { Tempo, TempoFactory } from './rhythm/tempo';

// const meter = MeterFactory(6, 16);
console.log(sheet(6, '8n', 2));
// const tempo = TempoFactory(120, '4n');
// const measure = MeasureFactory('2n-2n-4n-4n', meter, tempo);
// console.log(isValidMeasure(measure));

// const sh = sheet(6, '4n', 2);

// console.log(sh);
