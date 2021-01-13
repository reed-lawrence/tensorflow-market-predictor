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
    Utils.getFromDate = function (target, n, collection, targetMatchFor, collectionMatchFor) {
        if (targetMatchFor === void 0) { targetMatchFor = 'regularMarketTime'; }
        if (collectionMatchFor === void 0) { collectionMatchFor = 'regularMarketTime'; }
        if (n === 0) {
            throw new Error('n should not be 0 in getFromDate');
        }
        if (!target.price[targetMatchFor]) {
            throw new Error("No key matching price." + targetMatchFor + " in " + target.price.symbol);
        }
        // console.log(target.price);
        var d = Utils.toSimpleDate(target.price[targetMatchFor]);
        var targetDate = d.value;
        // console.log(`From date: ${d.str}`);
        // const newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10)
        var newDateStr = this.getFromDateStr(targetDate, n);
        // console.log(`Looking for date ${newDateStr}`);
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var entry = collection_1[_i];
            if (target.price.symbol === entry.price.symbol) {
                if (!entry.price[collectionMatchFor]) {
                    throw new Error("No key matching price." + collectionMatchFor + " in " + entry.price.symbol);
                }
                var entryDateStr = Utils.toSimpleDate(entry.price[collectionMatchFor]).str;
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
        if (adjustedDate.getDay() === 0) {
            adjustedDate.setDate(adjustedDate.getDate() - 2);
        }
        else if (adjustedDate.getDay() === 6) {
            adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        return adjustedDate.toISOString().substr(0, 10);
    };
    Utils.toSimpleDate = function (isoString) {
        if (isoString) {
            try {
                var parsed = isoString.split('T')[0];
                var split = parsed.split('-');
                var year = parseInt(split[0]);
                var month = parseInt(split[1]);
                var date = parseInt(split[2]);
                var value = new Date(year, month, date);
                var str = value.toISOString().substr(0, 10);
                return {
                    str: str,
                    year: year,
                    month: month,
                    date: date,
                    value: value
                };
            }
            catch (_a) { }
        }
        throw new Error("Cannot parse date: " + isoString);
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
//# sourceMappingURL=utils.js.map