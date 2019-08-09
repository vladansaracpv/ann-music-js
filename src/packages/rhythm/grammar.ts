// import { Duration } from './duration';

// export interface Rule {
//   name: string;
//   expansion: string;
//   isTerminal: boolean;
//   expand: () => string;
// }

// export class Rule {
//   static createRule = (name: string, expansion: string, isTerminal: boolean): Rule => {
//     const expand = () => {
//       const rules = expansion.split(' | ');
//       const i = Math.floor(Math.random() * rules.length);
//       return rules[i];
//     };

//     return {
//       name,
//       expansion,
//       isTerminal,
//       expand,
//     };
//   };

//   static createRuleForDuration = (duration: string | number, isTerminal = false): Rule => {
//     let name, value;

//     if (typeof duration == 'string') {
//       name = duration;
//       value = Duration.nameToValue(duration);
//     } else {
//       value = duration;
//       name = Duration.valueToName(duration);
//     }

//     const createTypes = (type: string) => (type === 't' ? type + value * 2 : type + value);
//     const createNext = (name: string) => {
//       const i = Duration.NAMES.indexOf(name);
//       const next = i < Duration.NAMES.length - 1 ? Duration.NAMES[i + 1] : '';
//       return next ? next + ' ' + next + ' | ' : '';
//     };

//     const types = createNext(name) + Duration.TYPES.map(createTypes).join(' | ');
//     return Rule.createRule(name, types, isTerminal);
//   };
// }

// export class Grammar {
//   rules: Record<string, Rule> = {};

//   static createGrammar = (longest: string, shortest: string, ts: number[]) => {
//     let rules: Rule[] = [];
//     const initDuration = Duration.valueToName(ts[1]) + ' ';
//     const beats = ts[0];
//     const expansion = initDuration.repeat(beats).trimRight();

//     const startRule = Rule.createRule('startRule', expansion, false);
//     const [li, si] = [Duration.nameIndex(longest), Duration.nameIndex(shortest)];
//     const notes = Duration.NAMES.slice(li, si + 1);
//     rules = [startRule, ...rules, ...notes.map(note => Rule.createRuleForDuration(note))];
//     return rules;
//   };

//   constructor(rules: Record<string, Rule>) {
//     this.rules = rules;
//   }
// }
