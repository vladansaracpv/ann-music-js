// /** Array methods */

// const name = id;
// const notNull = n => n === 0 || n;
// const uniqueLocal = (n: any, i: number, a: any[]) => eq(i, 0) || neq(n, a[--i]);

// export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

// export const split = (condition: string) => (str: string): string[] => str.split(condition);
// export const splitC = (condition: string) => (array: string[]): string[][] => array.map(split(condition));

// export const join = (condition: string) => (array: any[]): string => array.join(condition)
// export const joinC = (condition: string) => (array: any[]): string[] => array.map(join(condition));

// export const concat = (a: any[], b: any[]): any[] => [...a, ...b];
// export const concatN = (...args: any[]): any[] => args.reduce(concat);

// export const flatten = (array, depth = 2) => array.flat(depth);

// export const compact = (array: number[]) => array.filter(notNull);

// export const sort = (src: any[], fn = id) => compact(src.map(name)).sort((a, b) => fn(a) - fn(b));

// export const unique = (array: any[]) => sort(array).filter(uniqueLocal);

// export const swap = (arr: any[], a: number, b: number) => [arr[a], arr[b]] = [arr[b], arr[a]];

// export const rangeUp = (start: number, l: number): number[] => Array(l).fill(start).map(add);
// export const rangeDown = (start: number, l: number): number[] => Array(l).fill(start).map(sub);
// export const range = (one: number, other: number): number[] => {
//     if (lor(!isInteger(a), !isInteger(b))) return [];

//     return isEither(
//         rangeUp(a, abs(b - a + 1)),
//         rangeDown(a, abs(a - b + 1)),
//         gt(a, b)
//     );
// };

// export const shuffle = (array, rnd = Math.random) => {
//     let [i, n] = [0, array.length];

//     while (n) {
//         i = (rnd() * n--) | 0;
//         swap(array, n, i);
//     }

//     return array;
// };

// export const permutations = array => {
//     if (array.length === 0) return [[]];
//     return permutations(array.slice(1)).reduce((acc, perm) => {
//         return acc.concat(
//             array.map((e, pos) => {
//                 const newPerm = [...perm];
//                 newPerm.splice(pos, 0, array[0]);
//                 return newPerm;
//             })
//         );
//     }, []);
// };

// export const rotate = (n: number, array: any[]): any[] => {
//     const { length } = array;
//     const i = n % length;
//     return concat(array.slice(i, length), array.slice(0, i));
// };

// export const mapN = (fn: any, array: any[], n: number) => {
//     return isEither(
//         array,
//         mapN(fn, array.map(fn), n - 1),
//         eq(0, n)
//     )
// }

// export const callN = (fn: any, array: any[], n: number) => {
//     return isEither(
//         array,
//         callN(fn, array.map(fn), n - 1),
//         eq(0, n)
//     )
// }
