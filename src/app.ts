import { start } from './packages/scale';
import { chroma } from './packages/pc';

const set = chroma(['C', 'D', 'E']);
const set2 = '111010000000';
console.log(chroma(set2));
// player.play(
//   sequenceParser.parse([
//     'rest/4 B4/16 A4/16 G#4/16 A4/16',
//     'C5/8 rest/8 D5/16 C5/16 B4/16 C5/16',
//     'E5/8 rest/8 F5/16 E5/16 D#5/16 E5/16',
//     'B5/16 A5/16 G#5/16 A5/16 B5/16 A5/16 G#5/16 A5/16',
//     'C6/4 A5/8 C6/8',
//     'B5/8 A5/8 G5/8 A5/8',
//     'B5/8 A5/8 G5/8 A5/8',
//     'B5/8 A5/8 G5/8 F#5/8',
//     'E5/4',
//   ]),
// );

/**
 * Note
 * Interval
 * Chord
 * Scale
 * PC
 * Distance (Transpose)
 *
 * Parser
 * Duration
 * Midi
 * Composition
 * Player
 */
