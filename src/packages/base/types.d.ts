interface RangeType {
  start: number;
  end: number;
}

interface RangedGroup {
  range: RangeType;
  size: number;
}

type BinRelationFn<T> = (a: T, b: T) => boolean;
type CurryRelationFn<T> = (b: T) => (a: T) => boolean;

type Comparable = number | string;
type ComparableBinFn = BinRelationFn<Comparable>;
type ComparableCurryFn = CurryRelationFn<Comparable>;
