"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
function queryFormat(query, values) {
    if (!values)
        return query;
    return query.replace(/[@](\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return mysql_1.default.escape(values[key]);
        }
        return txt;
    });
}
exports.queryFormat = queryFormat;
var MySqlQuery = /** @class */ (function () {
    function MySqlQuery(qString, connection, options) {
        this.parameters = {};
        this.qString = qString;
        this.dbconn = connection;
        if (options) {
            if (options.parameters)
                this.parameters = options.parameters;
        }
    }
    MySqlQuery.prototype.queryAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dbconn.query(_this.qString, _this.parameters, function (err, results, fields) {
                if (err)
                    return reject(err);
                return resolve({ results: results, fields: fields });
            });
        });
    };
    MySqlQuery.prototype.executeNonQueryAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.queryAsync().then(function (q) {
                return resolve(q.results);
            }).catch(function (err) {
                return reject(err);
            });
        });
    };
    MySqlQuery.prototype.executeQueryAsync = function () {
        return this.queryAsync();
    };
    MySqlQuery.prototype.executeScalarAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.queryAsync().then(function (q) {
                var scalarObj = Object.assign({}, q.results[0]);
                if (!scalarObj) {
                    throw new Error('Unable to determine a scalar result to output');
                }
                else {
                    var output = scalarObj[Object.keys(scalarObj)[0]];
                    return resolve(output);
                }
            }).catch(function (err) { return reject(err); });
        });
    };
    return MySqlQuery;
}());
exports.MySqlQuery = MySqlQuery;
