import * as fs from 'fs';

import { IDefaultKeyStatistics } from './interfaces/default-key-statistics';
import { IEarnings } from './interfaces/earnings';
import { IPrice } from './interfaces/price';
import { ISummaryDetail } from './interfaces/summary-detail';
import { symbols } from './symbols';

const yahooFinance = require('yahoo-finance');

export type IApiResult = { summaryDetail: ISummaryDetail, defaultKeyStatistics: IDefaultKeyStatistics, earnings: IEarnings, price: IPrice };

export async function main() {
  console.clear();

  console.log('Creating distinct list of symbols');
  const symbols_distinct: string[] = [];
  for (const symbol of symbols) {
    if (symbols_distinct.findIndex(s => s === symbol) === -1) {
      symbols_distinct.push(symbol);
    }
  }

  console.log('Opening data file');
  const ds: IApiResult[] = JSON.parse(fs.readFileSync('./storage/ds.json', { encoding: 'utf8' }));
  for (const symbol of symbols_distinct) {
    console.log(`Getting data for ${symbol}...`);
    const results: IApiResult = await yahooFinance.quote({
      symbol,
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'earnings']
    });
    ds.push(results);
    console.clear();
  }
  console.log('Writing to file...');
  fs.writeFileSync('./storage/ds.json', JSON.stringify(ds));
}


