import { chord } from '@packages/chord';
import { scale } from '@packages/scale';
import { Note } from './factories';

// export const distance: NoteDistanceFn = ({ from, to, comparable = 'midi' }) => {
//   return Note({ name: to })[comparable] - Note({ name: from })[comparable];
// };

// export const distanceFn = (from?: NoteName, to?: NoteName, comparable: NoteComparable = 'midi') => {
//   if (!from) return (from: NoteName) => distanceFn(from, to, comparable);
//   if (!to) return (to: NoteName) => distanceFn(from, to, comparable);
//   return distance({ from, to, comparable });
// };
