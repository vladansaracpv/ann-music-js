import { chroma } from '../note/properties';
import { compose } from '../helpers';
import { WITH_FLATS, WITH_SHARPS } from '../note/theory';

const PC_SET_REGEX = /'^[01]{12}$'/;
const PC_SET_EMPTY = Object.freeze(Array(12).fill(0));

export const toPcSet = note => {
  const chroma_index = chroma(note) % 12;
  const set = PC_SET_EMPTY.map((n, i) => (i === chroma_index ? 1 : 0));
  //   const set = [...PC_SET_EMPTY];
  //   set[chroma(note) % 12] = 1;
  return set;
};

export const toBinary = note => {
  const chroma_bin = (chroma(note) % 12).toString(2);
  const note_bin = '0'.repeat(12 - chroma_bin.length).concat(chroma_bin);
  console.log(note_bin);
};

export const isPc = pc => PC_SET_REGEX.test(pc);

// compose(, chroma)(note)
