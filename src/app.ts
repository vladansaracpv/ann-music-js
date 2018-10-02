import * as distance from './note/distance';
import * as operators from './note/operators';
import * as note from './note/properties';
import * as transpose from './note/transpose';
import { Validator } from './note/validator';
import * as helpers from './helpers';
import * as factory from './note/factory';
import { Note } from './note/index';
import { Theory } from './interval/theory';
import { Properties } from './interval/properties';

import * as beat from './beat';

distance;
operators;
note;
Validator;
transpose;
factory;
Note;

Theory;
Properties;

beat;
