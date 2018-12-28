import { curry } from '../helpers';

export class FactoryError {

  static MISSING_ARGS = curry((...args) => {
    const dict = FactoryError.errorDict(args);
    console.log(`Couldn't create NOTE.${dict.forProp} just from NOTE.${dict.fromProp}: '${dict.withValue}'. Try with ${dict.need} included.`);
    return undefined;
  });

  static NO_FACTORY = curry((...args) => {
    const dict = FactoryError.errorDict(args);
    console.log(`Couldn't create NOTE.${dict.forProp} from NOTE.${dict.fromProp}: '${dict.withValue}'`);
    return undefined;
  });

  static errorDict = (args) => {
    return { forProp: args[0], fromProp: args[1], withValue: args[2], need: args.length === 4 ? args[3] : '' };
  };
}
