"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function rank() {
    return __awaiter(this, void 0, void 0, function () {
        var currentData, subsamples, _i, subsamples_1, sample;
        return __generator(this, function (_a) {
            currentData = JSON.parse(fs.readFileSync('./storage/current-data.json', { encoding: 'utf8' }));
            subsamples = currentData.map(function (d) {
                var beta = 0, trending = 0, shortRatio = 0, preMarketChange = 0;
                if (typeof d.defaultKeyStatistics.beta === 'number') {
                    beta = d.defaultKeyStatistics.beta;
                }
                else if (d.defaultKeyStatistics.beta && d.defaultKeyStatistics.beta.raw) {
                    beta = d.defaultKeyStatistics.beta.raw;
                }
                if (typeof d.price.regularMarketPrice === 'number' && typeof d.price.regularMarketPreviousClose === 'number') {
                    trending = d.price.regularMarketPrice - d.price.regularMarketPreviousClose;
                }
                if (d.defaultKeyStatistics.shortRatio && typeof d.defaultKeyStatistics.shortRatio === 'number') {
                    shortRatio = d.defaultKeyStatistics.shortRatio;
                }
                if (d.price.preMarketChange && typeof d.price.preMarketChange === 'number') {
                    preMarketChange = d.price.preMarketChange;
                }
                return {
                    symbol: d.price.symbol,
                    beta: beta,
                    trending: trending,
                    shortRatio: shortRatio,
                    preMarketChange: preMarketChange,
                    highDelta: 0,
                    deltaPercent: 0,
                    open: typeof d.price.regularMarketOpen === 'number' ? d.price.regularMarketOpen : d.price.regularMarketOpen.raw
                };
            });
            for (_i = 0, subsamples_1 = subsamples; _i < subsamples_1.length; _i++) {
                sample = subsamples_1[_i];
                sample.highDelta = predict(sample);
                sample.deltaPercent = (sample.highDelta / sample.open) * 100;
            }
            subsamples.sort(function (a, b) { return a.highDelta < b.highDelta ? 1 : a.highDelta > b.highDelta ? -1 : 0; });
            // console.log(subsamples);
            console.log(subsamples.filter(function (s) { return s.open < 30; }));
            return [2 /*return*/];
        });
    });
}
exports.rank = rank;
function predict(sample) {
    // Percent change model
    // return (sample.beta * 0.43913936614990234) +
    //   (sample.trending * 0.2725888788700104) +
    //   (sample.shortRatio * 0.07221806049346924) +
    //   (sample.preMarketChange * -0.22439055144786835) +
    //   1.0478475093841553;
    // Raw delta model
    return (sample.beta * 0.28961578011512756) +
        (sample.trending * 0.6951797604560852) +
        (sample.shortRatio * -0.009811404161155224) +
        (sample.preMarketChange * -0.45400524139404297) +
        0.45660850405693054;
}
exports.predict = predict;
rank().then(function () {
    console.log('Done!');
}).catch(function (err) {
    console.error(err);
});
