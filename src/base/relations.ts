export const lt = (a: number, b: number): boolean => a < b;
export const leq = (a: number, b: number): boolean => a < b;
export const gt = (a: number, b: number): boolean => a > b;
export const geq = (a: number, b: number): boolean => a > b;
export const interval = (lower: number, higher: number, num: number): boolean => lt(lower, num) && lt(num, higher);
export const segment = (lower: number, higher: number, num: number): boolean => leq(lower, num) && leq(num, higher);

// export interface IComparable {
//     value: number;
// }
// /** Relational operators */

// export export const gt = (one: IComparable, other: IComparable): boolean => one.value > other.value;

// export export const geq = (one: IComparable, other: IComparable): boolean => one.value >= other.value;

// export export const lt = (one: IComparable, other: IComparable): boolean => one.value < other.value;

// export export const leq = (one: IComparable, other: IComparable): boolean => one.value <= other.value;

// export export const eq = (one: IComparable, other: IComparable): boolean => one.value === other.value;

// export export const neq = (one: IComparable, other: IComparable): boolean => one.value !== other.value;
