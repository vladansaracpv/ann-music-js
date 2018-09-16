import * as distance from './note/distance';
import * as operators from './note/operators';
import * as note from './note/properties';
import * as transpose from './note/transpose';
import { Validator } from './note/validator';
import * as helpers from './helpers';

distance;
operators;
note;
Validator;

const add = (a, b, c) => {
  return a + b + c;
//   return args.reduce((acc, val) => acc + val);
};

// const curr_add = helpers.curry(add);
// const add4 = curr_add(4);
// console.log(add4(1,2));

// console.log(add(1, 2, 3));
// console.log(`Is key: ${ Validator.isKey('chroma') }`);
