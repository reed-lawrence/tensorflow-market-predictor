"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return Utils;
}());
exports.Utils = Utils;
