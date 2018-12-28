import { midi } from './properties';
import { diff2 } from '../helpers';

  export const distance = (...args) => {
    
    if(args.length === 1) 
      return (x, f=midi) => distance(x, args[0], f);
      
    if(args.length === 2) 
      return distance(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return Math.abs(diff2(f(x), f(y)));
  };

  export default {
    distance
  };
