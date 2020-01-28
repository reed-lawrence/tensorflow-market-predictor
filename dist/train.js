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
var tf = __importStar(require("@tensorflow/tfjs-node"));
var mathjs_1 = require("mathjs");
var get_data_1 = require("./methods/get-data");
var utils_1 = require("./utils");
function train() {
    return __awaiter(this, void 0, void 0, function () {
        var data, subsamples, filteredData, ys, beta, trending, shortRatio, preMarketChange, a, b, c, s, p, o, f, loss, learningRate, optimizer, i, preds, diffs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    return [4 /*yield*/, get_data_1.getData()];
                case 1:
                    data = _a.sent();
                    subsamples = data.map(function (entry) {
                        var deltaHigh = 0, beta = 0, trending = 0, shortRatio = 0, preMarketChange = 0, open = 0, symbol = entry.price.symbol;
                        var prevDayData = utils_1.Utils.getFromDate(entry, -1, data);
                        // Delta high that predicts next day data
                        // const nextDayEntry = Utils.getFromDate(entry, 1, data);
                        // if (
                        //   nextDayEntry &&
                        //   typeof nextDayEntry.price.regularMarketDayHigh === 'number' &&
                        //   typeof entry.price.regularMarketOpen === 'number'
                        // ) {
                        //   deltaHigh = nextDayEntry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
                        // }
                        // Delta high that predicts current day data
                        if (typeof entry.price.regularMarketOpen === 'number' && typeof entry.price.regularMarketDayHigh === 'number') {
                            deltaHigh = entry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
                            open = entry.price.regularMarketOpen;
                        }
                        // Delta high that predicts current day data based on percent change
                        // if (typeof entry.price.regularMarketOpen === 'number' && typeof entry.price.regularMarketDayHigh === 'number') {
                        //   deltaHigh = 100 - ((entry.price.regularMarketOpen / entry.price.regularMarketDayHigh) * 100);
                        // }
                        if (entry.defaultKeyStatistics && entry.defaultKeyStatistics.beta) {
                            if (typeof entry.defaultKeyStatistics.beta === 'number') {
                                beta = entry.defaultKeyStatistics.beta;
                            }
                            else {
                                beta = entry.defaultKeyStatistics.beta.raw || 0;
                            }
                        }
                        // This trending val works for training, but does not work for prediction
                        // if (typeof entry.price.regularMarketPrice === 'number' && typeof entry.price.regularMarketPreviousClose === 'number') {
                        //   trending = entry.price.regularMarketPrice - entry.price.regularMarketPreviousClose;
                        // }
                        // Trending relies on previous day data
                        if (prevDayData && prevDayData.price.regularMarketPreviousClose && entry.price.regularMarketPreviousClose) {
                            if (typeof prevDayData.price.regularMarketPreviousClose === 'number' && typeof entry.price.regularMarketPreviousClose === 'number') {
                                trending = entry.price.regularMarketPreviousClose - prevDayData.price.regularMarketPreviousClose;
                            }
                        }
                        if (entry.defaultKeyStatistics && entry.defaultKeyStatistics.shortRatio && typeof entry.defaultKeyStatistics.shortRatio === 'number') {
                            shortRatio = entry.defaultKeyStatistics.shortRatio;
                        }
                        if (entry.price.preMarketChange && typeof entry.price.preMarketChange === 'number') {
                            preMarketChange = entry.price.preMarketChange;
                        }
                        return {
                            deltaHigh: deltaHigh,
                            beta: beta,
                            trending: trending,
                            shortRatio: shortRatio,
                            preMarketChange: preMarketChange,
                            symbol: symbol,
                            open: open
                        };
                    });
                    filteredData = subsamples.filter(function (sample) { return sample.deltaHigh && sample.open && sample.open < 30 && sample.shortRatio && sample.beta && sample.trending; });
                    // const filteredData = subsamples;
                    console.log("Training data length: " + filteredData.length);
                    ys = tf.tensor1d(filteredData.map(function (o) { return o.deltaHigh; }));
                    beta = tf.tensor1d(filteredData.map(function (o) { return o.beta; }));
                    trending = tf.tensor1d(filteredData.map(function (o) { return o.trending; }));
                    shortRatio = tf.tensor1d(filteredData.map(function (o) { return o.shortRatio; }));
                    preMarketChange = tf.tensor1d(filteredData.map(function (o) { return o.preMarketChange; }));
                    a = tf.scalar(0).variable();
                    b = tf.scalar(0).variable();
                    c = tf.scalar(0).variable();
                    s = tf.scalar(0).variable();
                    p = tf.scalar(0).variable();
                    o = tf.scalar(0).variable();
                    f = function (_beta, _trending, _shortRatio, _preMarketChange) {
                        var output = a.mul(_beta)
                            .add(b.mul(_trending))
                            .add(s.mul(_shortRatio))
                            .add(p.mul(_preMarketChange))
                            .add(c);
                        // console.log(output);
                        return output;
                    };
                    loss = function (pred, label) { return pred.sub(label).square().mean(); };
                    learningRate = 0.001;
                    optimizer = tf.train.sgd(learningRate);
                    // Train the model.
                    for (i = 0; i < 1000; i++) {
                        optimizer.minimize(function () { return loss(f(beta, trending, shortRatio, preMarketChange), ys); });
                    }
                    preds = f(beta, trending, shortRatio, preMarketChange).dataSync();
                    diffs = [];
                    preds.forEach(function (pred, i) {
                        var expected = pred;
                        var actual = filteredData[i].deltaHigh;
                        var diff = (actual - expected);
                        diffs.push(diff);
                        var percent = 0;
                        if (actual !== 0) {
                            percent = (diff / Math.abs(expected)) * 100;
                        }
                        console.log("i: " + i + ", pred: " + mathjs_1.round(expected, 3) + ", actual: " + mathjs_1.round(actual, 3) + ", diff: " + mathjs_1.round(diff, 3) + ", percent: " + mathjs_1.round(percent, 3) + "%");
                        // console.log(`${round(expected, 3)},${round(actual, 3)}`);
                    });
                    console.log();
                    console.log("beta: " + a.dataSync() + ", trending: " + b.dataSync() + ", shortRatio: " + s.dataSync() + ", preMarketChange: " + p.dataSync() + ", c: " + c.dataSync());
                    console.log("Avg abs difference: " + mathjs_1.round(mathjs_1.mean(diffs.map(function (d) { return Math.abs(d); })), 2));
                    console.log("Std Deviation: " + mathjs_1.round(mathjs_1.std(diffs), 3));
                    console.log("Avg open: " + mathjs_1.mean(filteredData.map(function (d) { return d.open; })));
                    return [2 /*return*/];
            }
        });
    });
}
exports.train = train;
train().then(function () { console.log('Done!'); }).catch(function (err) {
    console.error(err);
});
