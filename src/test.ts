import { IChart } from './interfaces/chart';
import { Utils } from './utils';
import { getData } from './methods/get-data';
import { IApiResult } from './interfaces/api-result';
import { createConnection } from 'mysql';
import { queryFormat, MySqlQuery } from './mysql/mysql-query';
var yahooFinance = require('yahoo-finance');


export async function test() {
  
}

test().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.error(err);
})