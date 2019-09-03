// [name, pcset, fifths, triad, seventh, alias?]
// [r.b., pcset, fifths, name, triad, seventh, alias?]
// [2906, 3, 'aeolian', 'm', 'm7', 'minor'],

type ModeNumber = number;
type ModeName = string;
type ModePcSet = number;
type ModeFifths = number;
type ModeTriad = string;
type ModeSeventh = string;
type ModeAlias = string;

type ModeDefinition = [ModeNumber, ModePcSet, ModeFifths, ModeName, ModeTriad, ModeSeventh, ModeAlias?];
