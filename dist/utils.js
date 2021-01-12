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
    Utils.distinct = function (arr, predicate) {
        var output = [];
        var _loop_1 = function (obj) {
            var result = predicate(obj);
            if (output.findIndex(function (o) { return o === result; }) === -1) {
                output.push(result);
            }
        };
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var obj = arr_1[_i];
            _loop_1(obj);
        }
        return output;
    };
    ;
    Utils.getFromDate = function (target, n, collection) {
        if (n === 0) {
            throw new Error('n should not be 0 in getFromDate');
        }
        var targetDate = new Date(target.price.regularMarketTime);
        // console.log(`From date: ${targetDate.toISOString().substr(0, 10)}`);
        // const newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10)
        var newDateStr = this.getFromDateStr(targetDate, n);
        // console.log(`Looking for date ${newDate}`);
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var entry = collection_1[_i];
            if (target.price.symbol === entry.price.symbol) {
                var entryDateStr = new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);
                if (entryDateStr === newDateStr) {
                    return entry;
                }
            }
        }
        return;
    };
    Utils.getFromDateStr = function (targetDate, n) {
        if (!n) {
            throw new Error('n must be non zero in getFromDateStr');
        }
        // Date should only consider M-F days
        var adjustedDate = new Date(targetDate.setDate(targetDate.getDate() + n));
        // If the adjusted date is a sunday or saturday
        if (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6) {
            // Adjust the date until it is is a weekday
            for (var i = 0; i < 2; i++) {
                // If looking backwards - it should move the date backwards (Sunday -> Friday)
                if (n < 0) {
                    adjustedDate = new Date(adjustedDate.setDate(adjustedDate.getDate() - 1));
                }
                else {
                    adjustedDate = new Date(adjustedDate.setDate(adjustedDate.getDate() + 1));
                }
                // If the date is now valid, exit the loop;
                if (adjustedDate.getDay() > 0 && adjustedDate.getDay() < 6) {
                    i = 2;
                }
            }
        }
        return adjustedDate.toISOString().substr(0, 10);
    };
    Utils.toCsvString = function (objs, map) {
        var output = '';
        for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
            var obj = objs_1[_i];
            output += map(obj).join(',');
            output += '\r\n';
        }
        return output;
    };
    return Utils;
}());
exports.Utils = Utils;
