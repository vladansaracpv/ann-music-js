import { unique, sort } from './helpers';
import { STEP_FACTORY } from './note/factories/step'
import { FactoryParams } from './note/factories';

console.log(STEP_FACTORY(FactoryParams('pc', 'Eb')));
