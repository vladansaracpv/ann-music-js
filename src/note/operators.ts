import { midi } from './properties';
import { curry, allTrue } from '../helpers';

/**
 *  Class of operators used for comparing two notes x and y
 *  by function f (defaults to midi)
 * 
 *  Example: 
 *  - $ gt('C4', 'D5') = false
 *  - $ greater('C4', 'C#4') = 'C#4'
 */
export class Operators {

  /** 
   *  x > y ? x : y
   *  
   *  Returns greater of two notes: (x, y)
   *  Uses function(f) to get values for comparison
   */
  static greater = (...args) => {

    if(args.length === 1) 
      return (x, f=midi) => Operators.greater(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.greater(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) > f(y) ? x : y;
  }


  /**
   *  x < y ? x : y
   * 
   *  Returns smaller of two notes: (x, y)
   */
  static less = (...args) => {

    if(args.length === 1) 
      return (x, f=midi) => Operators.less(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.less(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) < f(y) ? x : y;
  }


  /**
   *  x > y
   * 
   *  Checks if @x is greater than @y by value returned by f
   */
  static gt = (...args) => {

    if(args.length === 1) 
      return (x, f=midi) => Operators.gt(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.gt(args[0], args[1]);
    
    const [x, y, f=midi] = args;
    return f(x) > f(y);
  }
  
  /**
   *  x >= y
   * 
   *  Checks if @x is greater or equal than @y for value returned by @f
   */
  static geq = (...args) => {
    
    if(args.length === 1) 
      return (x, f=midi) => Operators.geq(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.geq(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) >= f(y);
  }
    ​

  /**
   *  x === y
   * 
   *  Checks if @x is equal to @y for value returned by @f
   */
  static eq = (...args) => {
    
    if(args.length === 1) 
      return (y, f=midi) => Operators.eq(args[0], y, f);
      
    if(args.length === 2) 
      return Operators.eq(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) === f(y);
  }
    ​

  /**
   *  x < y
   * 
   *  Checks if @x is less than @y for value returned by @f
   */
  static lt = (...args) => {
    
    if(args.length === 1) 
      return (x, f=midi) => Operators.lt(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.lt(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) < f(y);
  }
    ​

  /**
   *  x <= y
   * 
   *  Checks if @x is less or equal than @y for value returned by @f
   */
  static leq = (...args) => {
    
    if(args.length === 1) 
      return (x, f=midi) => Operators.leq(x, args[0], f);
      
    if(args.length === 2) 
      return Operators.leq(args[0], args[1], midi);
    
    const [x, y, f=midi] = args;
    return f(x) <= f(y);
  }


  /**
   *  x < n < y
   * 
   *  Checks if note @n is between @x - @y for value returned by @f
   */
  static inInterval = (...args) => {
    
    if(args.length === 1) 
      return (x, y, f=midi)  => Operators.inInterval(x, y, args[0], f);
      
    if(args.length === 2) 
      return (n, f=midi) => Operators.inInterval(args[0], args[1], n, f);

    if(args.length === 3)
      return Operators.inInterval(args[0], args[1], args[2], midi);
    
    const [x, y, n, f=midi] = args;
    return allTrue(
      Operators.lt(x, n, f),
      Operators.lt(n, y, f)
    );
  }
    ​

  /**
   *  x <= n <= y
   * 
   *  Checks if note @n is between @x - @y for value returned by @f
   */
  static inSegment = (...args) => {
    
    if(args.length === 1) 
      return (x, y, f=midi)  => Operators.inInterval(x, y, args[0], f);
      
    if(args.length === 2) 
      return (n, f=midi) => Operators.inInterval(args[0], args[1], n, f);

    if(args.length === 3)
      return Operators.inInterval(args[0], args[1], args[2], midi);
    
    const [x, y, n, f=midi] = args;
    return allTrue(
      Operators.leq(x, n, f),
      Operators.leq(n, y, f)
    );
  }

}
