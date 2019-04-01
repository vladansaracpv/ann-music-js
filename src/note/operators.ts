
type Comparable = number | string;

const leq = (b: Comparable) => (a: Comparable): boolean => a <= b;
const lt = (b: Comparable) => (a: Comparable): boolean => a < b;
const eq = (b: Comparable) => (a: Comparable): boolean => a === b;
const gt = (b: Comparable) => (a: Comparable): boolean => a > b;
const geq = (b: Comparable) => (a: Comparable): boolean => a >= b;
const inInterval = (a: Comparable, b: Comparable) => (x: Comparable): boolean => lt(x)(a) && lt(b)(x);
const inSegment = (a: Comparable, b: Comparable) => (x: Comparable): boolean => leq(x)(a) && leq(b)(x);

interface OperatorsType {
    leq: (...args) => boolean,
    lt: (...args) => boolean,
    eq: (...args) => boolean,
    gt: (...args) => boolean,
    geq: (...args) => boolean,
    inInterval: (...args) => boolean,
    inSegment: (...args) => boolean
}

const Operators = {
    leq,
    lt,
    eq,
    gt,
    geq,
    inInterval,
    inSegment
};

export {
    OperatorsType,
    Operators
}
