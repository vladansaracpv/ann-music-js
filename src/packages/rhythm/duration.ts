import { compose2, compose } from '@base/functional';

export class Duration {
  public static NAMES = ['w', 'h', 'q', 'e', 's', 't'];
  public static VALUES = [1, 2, 4, 8, 16, 32];
  public static TYPES = ['n', 'r', 't'];

  public static valueIndex = (value: number) => {
    return Duration.VALUES.indexOf(value);
  };

  public static nameIndex = (name: string) => {
    return Duration.NAMES.indexOf(name);
  };

  public static nameToValue = (name: string) => {
    const i = Duration.NAMES.indexOf(name);
    return Duration.VALUES[i] || undefined;
  };

  public static valueToName = (value: number) => {
    const i = Duration.valueIndex(value);
    return Duration.NAMES[i] || undefined;
  };

  public static splitValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i + 1] : undefined;
  };

  public static splitName = (name: string) => {
    return compose2(Duration.splitValue, Duration.nameToValue);
  };

  public static doubleValue = (value: number) => {
    const i = Duration.valueIndex(value);
    return i > -1 ? Duration.VALUES[i - 1] : undefined;
  };

  public static doubleName = (name: string) => {
    return compose(
      Duration.valueToName,
      Duration.doubleValue,
      Duration.nameToValue,
    )(name);
  };

  public static toDuration = (value: number, duration: number) => {
    if (value > duration) return undefined;
    const [oldname, newName] = [Duration.valueToName(value), Duration.valueToName(duration)];
    const places = duration / value - 1;
    return oldname.concat('-'.repeat(places));
  };

  public static toDurationN = (value: string, duration: string) => {
    const nDuration = Duration.nameToValue(duration);
    // return Duration.toDuration(Duration.nameToValue(value), nDuration);
    const values = value
      .split('')
      .map(val => Duration.nameToValue(val))
      .map(val => Duration.toDuration(val, nDuration))
      .join('');
    return values;
  };
}
