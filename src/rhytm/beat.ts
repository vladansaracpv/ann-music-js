import { NoteValue, NoteType, NoteValueType } from './duration';

const sum = (total: number, value: number) => total + value;
const isValid = (notes: string): boolean => /^([whqest]{1}\.?){1}(-([whqest]{1}\.?))*$/.test(notes);

interface BeatType {
  notes: NoteValueType[];
  length: number;
  simple: string;
  duration: number;
  noteAt(index: number): NoteValueType;
  durationAt(index: number): number;
  timeline(): NoteTimelineType[];
}

interface NoteTimelineType {
  time: number;
  note: NoteType,
  duration: number;
}

const Beat = (value: string): BeatType => {
  if (!isValid(value)) return null;
  const notes = <NoteValueType[]>value.split('-').map(NoteValue);
  const length = notes.length;
  const simple = value;
  const duration = notes.map(note => note.duration).reduce(sum);
  const noteAt = (index: number): NoteValueType => index <= notes.length ? notes[index] : null;
  const durationAt = (index: number): number => noteAt(index) ? noteAt(index).duration : null;
  const timeline = (): NoteTimelineType[] => notes
    .reduce((acc, value, index) => [...acc, acc[index] + value.duration], [0])
    .slice(0, length - 1)
    .map((time, index) => ({ time, note: notes[index].type, duration: notes[index].duration }));

  return {
    notes,
    length,
    simple,
    duration,
    noteAt,
    durationAt,
    timeline
  }
}

export {
  Beat,
  BeatType
}

