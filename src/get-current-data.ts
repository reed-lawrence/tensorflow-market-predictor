import { Utils } from './utils';
import { IApiResult } from './interfaces/api-result';
const yahooFinance = require('yahoo-finance');
import * as fs from 'fs';

export async function getCurrentData() {
  const symbols = Utils.distinctSymbols();

  const ds: IApiResult[] = [];
  for (const symbol of symbols) {
    console.log(`Getting data for ${symbol}...`);
    const results: IApiResult = await yahooFinance.quote({
      symbol,
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'earnings']
    });
    ds.push(results);
    console.clear();
  }
  fs.writeFileSync('./storage/current-data.json', JSON.stringify(ds));
  return;
}

getCurrentData().then(() => {
  console.clear();
  console.log('Done!');
}).catch(err => {
  console.error(err);
});