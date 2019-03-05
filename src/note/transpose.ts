// import { midi } from './properties';
// import { NAME } from './factories/name';
// import { NO_NOTE } from './theory';
// import { isEither, eq } from '../helpers';

// export const semitones = (...args) => {
//   const [amount, note] = args;
//   const { length } = args;

//   if (eq(0, length)) return NO_NOTE;

//   return isEither(
//     (note: string) => semitones(amount, note),
//     NAME.fromMidi(midi(note) + amount),
//     eq(length, 1)
//   )

// };

// export const next = (amount = 1, note: string): string => semitones(amount, note)

// export const prev = (amount = 1, note: string): string => semitones(-amount, note);
