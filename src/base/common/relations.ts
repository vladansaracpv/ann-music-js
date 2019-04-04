

export interface IComparable {
    value: number;
}
/** Relational operators */

export const gt = (one: IComparable, other: IComparable): boolean => one.value > other.value;

export const geq = (one: IComparable, other: IComparable): boolean => one.value >= other.value;

export const lt = (one: IComparable, other: IComparable): boolean => one.value < other.value;

export const leq = (one: IComparable, other: IComparable): boolean => one.value <= other.value;

export const eq = (one: IComparable, other: IComparable): boolean => one.value === other.value;

export const neq = (one: IComparable, other: IComparable): boolean => one.value !== other.value;
