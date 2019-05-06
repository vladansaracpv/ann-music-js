export interface Range {
  start: number;
  end: number;
}

export interface RangedGroup {
  range: Range;
  size: number;
}

/**
 * Returns the intersection between two ranges as a range itself.
 * Returns `{ start: 0, end: 0 }` if the intersection is empty.
 */
export function intersect(one: Range, other: Range): Range {
  if (one.start >= other.end || other.start >= one.end) {
    return { start: 0, end: 0 };
  }

  const start = Math.max(one.start, other.start);
  const end = Math.min(one.end, other.end);

  if (end - start <= 0) {
    return { start: 0, end: 0 };
  }

  return { start, end };
}

export function isEmpty(range: Range): boolean {
  return range.end - range.start <= 0;
}

export function intersects(one: Range, other: Range): boolean {
  return !isEmpty(intersect(one, other));
}

export function relativeComplement(one: Range, other: Range): Range[] {
  const result: Range[] = [];
  const first = { start: one.start, end: Math.min(other.start, one.end) };
  const second = { start: Math.max(other.end, one.start), end: one.end };

  if (!isEmpty(first)) {
    result.push(first);
  }

  if (!isEmpty(second)) {
    result.push(second);
  }

  return result;
}
