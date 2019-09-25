interface RangeType {
  start: number;
  end: number;
}

interface RangedGroup {
  range: RangeType;
  size: number;
}
/**
 * Returns the intersection between two ranges as a range itself.
 * Returns `{ start: 0, end: 0 }` if the intersection is empty.
 */
export function intersect(one: RangeType, other: RangeType): RangeType {
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

export function isEmpty(range: RangeType): boolean {
  return range.end - range.start <= 0;
}

export function intersects(one: RangeType, other: RangeType): boolean {
  return !isEmpty(intersect(one, other));
}

export function relativeComplement(one: RangeType, other: RangeType): RangeType[] {
  const result: RangeType[] = [];
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
