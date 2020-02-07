import * as fs from 'fs';
import { Utils } from './utils';
import { IApiResult } from './interfaces/api-result';
import { createConnection } from 'mysql';
import { queryFormat, MySqlQuery } from './mysql/mysql-query';
import { IChart } from './interfaces/chart';
import { getData } from './methods/get-data';

const yahooFinance = require('yahoo-finance');
export async function main() {
  console.clear();

  console.log('Creating distinct list of symbols');
  const symbols_distinct: string[] = Utils.distinctSymbols();


  const data: IApiResult[] = [];
  const chartData: IChart[] = [];
  for (const symbol of symbols_distinct) {
    console.log(`Getting data for ${symbol}...`);
    const results: IApiResult = await yahooFinance.quote({
      symbol,
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'earnings']
    });
    data.push(results);

    // const chart: IChart = await yahooFinance.chart(symbol);
    // chartData.push(chart);
    console.clear();
  }

  const dbconn = createConnection({
    host: 'localhost',
    user: 'root',
    password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
    database: 'market_data',
    queryFormat
  });
  console.log('Writing to sql...');
  for (const entry of data) {
    console.log(`Inserting ${entry.price.symbol}...`);
    let query = new MySqlQuery('INSERT INTO single_day_data (data) VALUES (@data)', dbconn, {
      parameters: {
        data: JSON.stringify(entry)
      }
    });

    let result = await query.executeNonQueryAsync();

    console.clear();
  }

  for (const entry of chartData) {
    console.log(`Inserting chart data for ${entry.result[0].meta.symbol}...`);
    const query = new MySqlQuery('INSERT INTO charts (data) VALUES (@data)', dbconn, {
      parameters: {
        data: JSON.stringify(entry)
      }
    });

    const result = await query.executeNonQueryAsync();
    console.clear();
  }

  dbconn.end();

  // Validate that it actually saved
  const dbData = await getData();
  const today = new Date().toISOString().substr(0, 10);
  console.log(dbData.filter(entry => new Date(entry.price.regularMarketTime).toISOString().substr(0, 10)).length > 0);

  return;
}


