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
var mysql_1 = require("mysql");
var get_daily_data_1 = require("./methods/get-daily-data");
var store_data_1 = require("./methods/store-data");
var mysql_query_1 = require("./mysql/mysql-query");
var remove_duplicates_1 = require("./methods/remove-duplicates");
var symbols_1 = require("./symbols");
var validate_data_1 = require("./methods/validate-data");
var get_data_from_db_1 = require("./methods/get-data-from-db");
var train_1 = require("./methods/train");
var rank_1 = require("./methods/rank");
var train_dynamic_1 = require("./methods/train-dynamic");
function Main() {
    return __awaiter(this, void 0, void 0, function () {
        var dbconn, args, data, chartData, _i, args_1, arg, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbconn = mysql_1.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
                        database: 'market_data',
                        queryFormat: mysql_query_1.queryFormat
                    });
                    args = process.argv;
                    data = [];
                    chartData = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 20, , 21]);
                    _i = 0, args_1 = args;
                    _a.label = 2;
                case 2:
                    if (!(_i < args_1.length)) return [3 /*break*/, 19];
                    arg = args_1[_i];
                    if (!(arg === '--pull')) return [3 /*break*/, 4];
                    return [4 /*yield*/, get_daily_data_1.GetDailyData(symbols_1.symbols)];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 18];
                case 4:
                    if (!(arg === '--get')) return [3 /*break*/, 6];
                    return [4 /*yield*/, get_data_from_db_1.GetDataFromDb(dbconn)];
                case 5:
                    data = _a.sent();
                    return [3 /*break*/, 18];
                case 6:
                    if (!(arg === '--store')) return [3 /*break*/, 8];
                    return [4 /*yield*/, store_data_1.StoreData(data, chartData, dbconn)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 8:
                    if (!(arg === '--validate')) return [3 /*break*/, 10];
                    return [4 /*yield*/, validate_data_1.ValidateData(data, dbconn)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 10:
                    if (!(arg === '--dedupe')) return [3 /*break*/, 12];
                    return [4 /*yield*/, remove_duplicates_1.RemoveDuplicates(dbconn)];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 12:
                    if (!(arg === '--train')) return [3 /*break*/, 14];
                    return [4 /*yield*/, train_1.Train(data, dbconn)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 14:
                    if (!(arg === '--rank')) return [3 /*break*/, 16];
                    return [4 /*yield*/, rank_1.Rank(data, dbconn)];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 16:
                    if (!(arg === '--train-dynamic')) return [3 /*break*/, 18];
                    return [4 /*yield*/, train_dynamic_1.TrainDynamic(data)];
                case 17:
                    _a.sent();
                    _a.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 2];
                case 19: return [3 /*break*/, 21];
                case 20:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 21];
                case 21:
                    ;
                    dbconn.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.Main = Main;
Main().finally(function () {
    console.log('Done!');
});
//# sourceMappingURL=index.js.map