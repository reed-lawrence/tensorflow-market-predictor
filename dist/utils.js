"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = require("./symbols");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.mean = function (arr) {
        if (arr.length === 0) {
            throw new Error('Cannot find mean of empty array');
        }
        var total = 0;
        arr.forEach(function (num) { return total += num; });
        return total / arr.length;
    };
    Utils.distinctSymbols = function () {
        var output = [];
        var _loop_1 = function (symbol) {
            if (output.findIndex(function (s) { return s === symbol; }) === -1) {
                output.push(symbol);
            }
        };
        for (var _i = 0, symbols_2 = symbols_1.symbols; _i < symbols_2.length; _i++) {
            var symbol = symbols_2[_i];
            _loop_1(symbol);
        }
        return output;
    };
    Utils.getFromDate = function (target, n, collection) {
        var targetDate = new Date(target.price.regularMarketTime);
        // console.log(`From date: ${targetDate.toISOString().substr(0, 10)}`);
        var newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10);
        // console.log(`Looking for date ${newDate}`);
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var entry = collection_1[_i];
            var entryDate = new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);
            if (entryDate === newDate && target.price.symbol === entry.price.symbol) {
                return entry;
            }
        }
        return;
    };
    return Utils;
}());
exports.Utils = Utils;
