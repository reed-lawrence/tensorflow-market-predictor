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
var fs = __importStar(require("fs"));
var mathjs_1 = require("mathjs");
function getData() {
    var ds = JSON.parse(fs.readFileSync('./storage/ds.json', { encoding: 'utf8' }));
    return ds;
}
exports.getData = getData;
function train() {
    return __awaiter(this, void 0, void 0, function () {
        var beta_vals, trending_vals, y_vals, shortRatio_vals, preMarketChange_vals, open_vals, data, _i, data_1, entry, open_1, yVal, beta_1, trending_1, shortRatio_1, preMarketChange_1, ys, beta, trending, shortRatio, preMarketChange, a, b, c, s, p, o, f, loss, learningRate, optimizer, i, preds, diffs, percents, avgAbsPercent;
        return __generator(this, function (_a) {
            console.clear();
            beta_vals = [];
            trending_vals = [];
            y_vals = [];
            shortRatio_vals = [];
            preMarketChange_vals = [];
            open_vals = [];
            data = getData();
            for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                entry = data_1[_i];
                open_1 = 0;
                yVal = 0;
                if (typeof entry.price.regularMarketDayHigh === 'number' && typeof entry.price.regularMarketOpen === 'number') {
                    yVal = entry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
                    open_1 = entry.price.regularMarketOpen;
                    // console.log(yVal);
                    y_vals.push(yVal);
                    open_vals.push(open_1);
                    beta_1 = 0;
                    if (entry.defaultKeyStatistics.beta) {
                        if (typeof entry.defaultKeyStatistics.beta === 'number') {
                            beta_1 = entry.defaultKeyStatistics.beta;
                        }
                        else {
                            beta_1 = entry.defaultKeyStatistics.beta.raw || 0;
                        }
                    }
                    // console.log(beta);
                    beta_vals.push(beta_1);
                    trending_1 = 0;
                    if (typeof entry.price.regularMarketPrice === 'number' && typeof entry.price.regularMarketPreviousClose === 'number') {
                        trending_1 = entry.price.regularMarketPrice - entry.price.regularMarketPreviousClose;
                    }
                    // console.log(trending)
                    trending_vals.push(trending_1);
                    shortRatio_1 = 0;
                    if (entry.defaultKeyStatistics.shortRatio && typeof entry.defaultKeyStatistics.shortRatio === 'number') {
                        shortRatio_1 = entry.defaultKeyStatistics.shortRatio;
                    }
                    shortRatio_vals.push(shortRatio_1);
                    preMarketChange_1 = 0;
                    if (entry.price.preMarketChange && typeof entry.price.preMarketChange === 'number') {
                        preMarketChange_1 = entry.price.preMarketChange;
                    }
                    preMarketChange_vals.push(preMarketChange_1);
                }
            }
            ys = tf.tensor1d(y_vals);
            beta = tf.tensor1d(beta_vals);
            trending = tf.tensor1d(trending_vals);
            shortRatio = tf.tensor1d(shortRatio_vals);
            preMarketChange = tf.tensor1d(preMarketChange_vals);
            a = tf.scalar(Math.random()).variable();
            b = tf.scalar(Math.random()).variable();
            c = tf.scalar(Math.random()).variable();
            s = tf.scalar(Math.random()).variable();
            p = tf.scalar(Math.random()).variable();
            o = tf.scalar(Math.random()).variable();
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
            for (i = 0; i < 10000; i++) {
                optimizer.minimize(function () { return loss(f(beta, trending, shortRatio, preMarketChange), ys); });
            }
            preds = f(beta, trending, shortRatio, preMarketChange).dataSync();
            diffs = [];
            percents = [];
            preds.forEach(function (pred, i) {
                var expected = pred;
                var actual = y_vals[i];
                var diff = (actual - expected);
                diffs.push(diff);
                var percent = 0;
                if (actual !== 0) {
                    percent = (diff / Math.abs(expected)) * 100;
                    percents.push(Math.abs(percent));
                }
                // console.log(`i: ${i}, pred: ${round(expected, 3)}, actual: ${round(actual, 3)}, diff: ${round(diff, 3)}, percent: ${round(percent, 3)}%`);
                // console.log(`${round(expected, 3)},${round(actual, 3)}`);
            });
            console.log();
            avgAbsPercent = mathjs_1.round(mathjs_1.mean(percents), 3);
            console.log("Avg abs difference: $" + mathjs_1.round(mathjs_1.mean(diffs.map(function (d) { return Math.abs(d); })), 2));
            console.log("Avg absolute prediction variance: " + avgAbsPercent + "%");
            console.log("Std Deviation: " + mathjs_1.round(mathjs_1.std(diffs), 3));
            console.log("Significant model fit: " + (100 - avgAbsPercent) + "%");
            return [2 /*return*/];
        });
    });
}
exports.train = train;
train().catch(function (err) {
    console.error(err);
});
