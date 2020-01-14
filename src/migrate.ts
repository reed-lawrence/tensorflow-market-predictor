import { createConnection, createPool } from 'mysql';
import { IApiResult } from './interfaces/api-result';
import * as fs from 'fs';
import { MySqlQuery, queryFormat } from './mysql/mysql-query';
import { movingAverage } from '@tensorflow/tfjs-node';



export async function migrate() {
  const jsonData: IApiResult[] = JSON.parse(fs.readFileSync('./storage/ds.json', { encoding: 'utf8' }));
  const dbconn = createConnection({
    host: 'localhost',
    user: 'root',
    password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
    database: 'market_data',
    queryFormat
  });

  console.clear();
  console.log('Connecion established');
  for (const entry of jsonData) {
    console.log(`Inserting ${entry.price.symbol}...`);
    const query = new MySqlQuery('INSERT INTO single_day_data (data) VALUES (@data)', dbconn, {
      parameters: {
        data: JSON.stringify(entry)
      }
    });

    const result = await query.executeNonQueryAsync();
    console.clear();
  }
  return;
}

migrate().then(() => { console.log('Done!'); }).catch(err => { console.error(err); });