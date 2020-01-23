import { IChart } from './interfaces/chart';
var yahooFinance = require('yahoo-finance');


export async function test() {
  yahooFinance.chart('BBBY').then((res: IChart) => {
    console.log(new Date((res.result[0].timestamp[0] + res.result[0].meta.gmtoffset) * 1000 ));
    console.log(res.result[0].indicators.quote[0].open.length);
  });
}

test().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.error(err);
})