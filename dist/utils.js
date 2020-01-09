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
    return Utils;
}());
exports.Utils = Utils;
