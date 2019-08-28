/**
 * Generic interface for distance fn params. It is an object with 3 properties:
 * @param {T} from
 * @param {T} to
 * @param {U} comparable property
 *
 */
interface DistanceFnParams<T, U> {
  from: T;
  to: T;
  comparable?: U;
}

/**
 * Generic Distance fn type.
 * @param {T} params
 * @return {number}
 */
type DistanceFn<T> = (params: T) => number;

/**
 * Generic comparable fn
 * @param {T} type of fn parameters that will be compared
 * @param {U} return type of comparison. Can be boolean, number, string, etc
 * @return {U}
 */
type ComparableFn<T, U> = (a: T, b?: T) => U;

/**
 * Generic transposable fn
 * @param {T} first argument type. One that will be transposed
 * @param {U} second argument type. One used for transposition
 * @return {U} returns transposed value
 */
type TransposableFn<T, U> = (a: T, b?: U) => U;
