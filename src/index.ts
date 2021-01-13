import { createConnection } from 'mysql';
import { IApiResult } from './interfaces/api-result';

import { GetDailyData } from './methods/get-daily-data';
import { StoreData } from './methods/store-data';
import { queryFormat } from './mysql/mysql-query';
import { RemoveDuplicates } from './methods/remove-duplicates';
import { symbols as Targets } from './symbols';
import { IChart } from './interfaces/chart';
import { ValidateData } from './methods/validate-data';
import { GetDataFromDb } from './methods/get-data-from-db';
import { Train } from './methods/train';
import { Rank } from './methods/rank';
import { TrainDynamic } from './methods/train-dynamic';

export async function Main() {

  const dbconn = createConnection({
    host: 'localhost',
    user: 'root',
    password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
    database: 'market_data',
    queryFormat
  });

  const args = process.argv;
  var data: IApiResult[] = [];
  var chartData: IChart[] = []

  try {

    for (const arg of args) {
      // Get data from yahoo
      if (arg === '--pull') {
        data = await GetDailyData(Targets);
      }

      // Get data from the database
      else if (arg === '--get') {
        data = await GetDataFromDb(dbconn);
      }

      // Store the data to the database
      else if (arg === '--store') {
        await StoreData(data, chartData, dbconn);
      }
      // Validate that the data was stored to the database
      else if (arg === '--validate') {
        await ValidateData(data, dbconn);
      }

      // Remove any duplicates in the database
      else if (arg === '--dedupe') {
        await RemoveDuplicates(dbconn);
      }

      // Run the training algo
      else if (arg === '--train') {
        await Train(data, dbconn);
      }

      // Run the ranking algo
      else if (arg === '--rank') {
        await Rank(data, dbconn);
      }

      else if (arg === '--train-dynamic') {
        await TrainDynamic(data);
      }

    }

  } catch (e) {
    console.error(e);
  };

  dbconn.end();

}

Main().finally(() => {
  console.log('Done!')
});
