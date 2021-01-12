
import { IApiResult } from '../interfaces/api-result';
import * as fs from 'fs';
const yahooFinance = require('yahoo-finance');

export interface IDailyDataCache {
  date: string;
  data: IApiResult[];
}

export async function GetDailyData(symbols: string[]) {

  const cache: IDailyDataCache = JSON.parse(fs.readFileSync('./storage/current-data.json', { encoding: 'utf8' }));

  const today = new Date().toISOString().substr(0, 10);

  if (cache && cache.date === today) {
    return cache.data;
  }

  const data: IApiResult[] = [];
  for (const symbol of symbols) {
    console.log(`Getting data for ${symbol}...`);
    try {
      const results: IApiResult = await yahooFinance.quote({
        symbol,
        modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'earnings']
      });
      data.push(results);
    } catch {
      console.error(`Unable to get data for ${symbol}`);
    }
  }

  const toCache: IDailyDataCache = {
    date: today,
    data
  };

  fs.writeFileSync('./storage/current-data.json', JSON.stringify(toCache));

  return data;
}