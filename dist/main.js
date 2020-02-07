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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var mysql_1 = require("mysql");
var mysql_query_1 = require("./mysql/mysql-query");
var get_data_1 = require("./methods/get-data");
var yahooFinance = require('yahoo-finance');
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var symbols_distinct, data, chartData, _i, symbols_distinct_1, symbol, results, dbconn, _a, data_1, entry, query, result, _b, chartData_1, entry, query, result, dbData, today;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.clear();
                    console.log('Creating distinct list of symbols');
                    symbols_distinct = utils_1.Utils.distinctSymbols();
                    data = [];
                    chartData = [];
                    _i = 0, symbols_distinct_1 = symbols_distinct;
                    _c.label = 1;
                case 1:
                    if (!(_i < symbols_distinct_1.length)) return [3 /*break*/, 4];
                    symbol = symbols_distinct_1[_i];
                    console.log("Getting data for " + symbol + "...");
                    return [4 /*yield*/, yahooFinance.quote({
                            symbol: symbol,
                            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'earnings']
                        })];
                case 2:
                    results = _c.sent();
                    data.push(results);
                    // const chart: IChart = await yahooFinance.chart(symbol);
                    // chartData.push(chart);
                    console.clear();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    dbconn = mysql_1.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
                        database: 'market_data',
                        queryFormat: mysql_query_1.queryFormat
                    });
                    console.log('Writing to sql...');
                    _a = 0, data_1 = data;
                    _c.label = 5;
                case 5:
                    if (!(_a < data_1.length)) return [3 /*break*/, 8];
                    entry = data_1[_a];
                    console.log("Inserting " + entry.price.symbol + "...");
                    query = new mysql_query_1.MySqlQuery('INSERT INTO single_day_data (data) VALUES (@data)', dbconn, {
                        parameters: {
                            data: JSON.stringify(entry)
                        }
                    });
                    return [4 /*yield*/, query.executeNonQueryAsync()];
                case 6:
                    result = _c.sent();
                    console.clear();
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    _b = 0, chartData_1 = chartData;
                    _c.label = 9;
                case 9:
                    if (!(_b < chartData_1.length)) return [3 /*break*/, 12];
                    entry = chartData_1[_b];
                    console.log("Inserting chart data for " + entry.result[0].meta.symbol + "...");
                    query = new mysql_query_1.MySqlQuery('INSERT INTO charts (data) VALUES (@data)', dbconn, {
                        parameters: {
                            data: JSON.stringify(entry)
                        }
                    });
                    return [4 /*yield*/, query.executeNonQueryAsync()];
                case 10:
                    result = _c.sent();
                    console.clear();
                    _c.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12:
                    dbconn.end();
                    return [4 /*yield*/, get_data_1.getData()];
                case 13:
                    dbData = _c.sent();
                    today = new Date().toISOString().substr(0, 10);
                    console.log(dbData.filter(function (entry) { return new Date(entry.price.regularMarketTime).toISOString().substr(0, 10); }).length > 0);
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
