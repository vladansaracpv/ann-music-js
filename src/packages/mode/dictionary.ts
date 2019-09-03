import { intervals as chromaToIntervals, EmptySet } from '@packages/pc';
import DATA from './data';

export interface Mode extends PcProperties {
  readonly intervals: IvlName[];
  readonly modeNum: number;
  readonly name: string;
  readonly alt: number; // number of alterations === number of fiths
  readonly triad: string;
  readonly seventh: string;
  readonly aliases: string[];
}

const NoMode: Mode = {
  ...EmptySet,
  intervals: [],
  name: '',
  modeNum: NaN,
  alt: 0,
  triad: '',
  seventh: '',
  aliases: [],
};

const all: Mode[] = DATA.map(toMode);
const index: Record<string, Mode> = {};
all.forEach(mode => {
  index[mode.name] = mode;
  mode.aliases.forEach(alias => {
    index[alias] = mode;
  });
});

type ModeLiteral = string | Named;

/**
 * Get a Mode by it's name
 *
 * @example
 * mode('dorian')
 * // =>
 * // {
 * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
 * //   modeNum: 1,
 * //   chroma: '101101010110',
 * //   normalized: '101101010110',
 * //   name: 'dorian',
 * //   setNum: 2902,
 * //   alt: 2,
 * //   triad: 'm',
 * //   seventh: 'm7',
 * //   aliases: []
 * // }
 */
export function mode(name: ModeLiteral): Mode {
  return typeof name === 'string' ? index[name.toLowerCase()] || NoMode : name && name.name ? mode(name.name) : NoMode;
}

/**
 * Get a list of all know modes
 */
export function entries() {
  return all.slice();
}

function toMode(mode: ModeDefinition): Mode {
  // type ModeDefinition = [ModePcSet, ModeFifths, ModeName, ModeTriad, ModeSeventh, ModeAlias?];
  // [2906, 3, 'aeolian', 'm', 'm7', 'minor'],

  const [modeNum, num, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(num).toString(2);
  const intervals = chromaToIntervals(chroma);
  return {
    empty: false,
    intervals,
    modeNum: +modeNum,
    chroma,
    normalized: chroma,
    name,
    num,
    alt,
    triad,
    seventh,
    aliases,
  };
}
