import * as fs from 'fs';
import { Utils } from './utils';
import { IApiResult } from './interfaces/api-result';

const yahooFinance = require('yahoo-finance');
export async function main() {
  console.clear();

  console.log('Creating distinct list of symbols');
  const symbols_distinct: string[] = Utils.distinctSymbols();


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


