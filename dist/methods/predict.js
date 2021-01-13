"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function predict(sample) {
    var model = JSON.parse(fs.readFileSync('./storage/training_model.json', { encoding: 'utf8' }));
    return (sample.beta * model.beta) +
        (sample.trending * model.trending) +
        (sample.shortRatio * model.shortRatio) +
        (sample.preMarketChange * model.preMarketChange) +
        model.c;
}
exports.predict = predict;
//# sourceMappingURL=predict.js.map