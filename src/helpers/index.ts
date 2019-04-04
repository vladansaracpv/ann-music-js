

/** Transformation methods */

export const withTick = array => array.map(el => `'${el}'`);

export const or = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return argsWithTick.join(' / ');
};

export const and = (args, hasTick = false) => {
  const argsWithTick = hasTick ? args : withTick(args);
  return `[ ${argsWithTick.join(', ')} ]`;
};
