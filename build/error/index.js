"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class FactoryError {
}
FactoryError.NEED_MORE_ARGS = helpers_1.curry((...args) => {
    const dict = FactoryError.errorDict(args);
    console.log(`Couldn't create NOTE.${dict.forProp} just from NOTE.${dict.fromProp}: '${dict.withValue}'. Try with ${dict.need} included.`);
    return undefined;
});
FactoryError.NO_FACT_FOR_PARAM = helpers_1.curry((...args) => {
    const dict = FactoryError.errorDict(args);
    console.log(`Couldn't create NOTE.${dict.forProp} from NOTE.${dict.fromProp}: '${dict.withValue}'`);
    return undefined;
});
FactoryError.errorDict = (args) => {
    return { forProp: args[0], fromProp: args[1], withValue: args[2], need: args.length === 4 ? args[3] : '' };
};
exports.FactoryError = FactoryError;
//# sourceMappingURL=index.js.map