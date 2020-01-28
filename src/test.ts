import { IChart } from './interfaces/chart';
import { Utils } from './utils';
var yahooFinance = require('yahoo-finance');


export async function test() {
  const testDate = new Date();
  Utils.getFromDateStr(testDate, 4);
}

test().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.error(err);
})