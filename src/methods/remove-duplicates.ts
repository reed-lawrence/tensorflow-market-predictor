

import { Connection } from 'mysql';

import { IApiResult } from '../interfaces/api-result';
import { GetDataFromDb } from './get-data-from-db';
import { MySqlQuery } from '../mysql/mysql-query';

export async function RemoveDuplicates(dbconn: Connection) {
  const data = await GetDataFromDb(dbconn);

  const entryArrays: IApiResult[][] = [];
  for (const entry of data) {
    const entryDate = new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);

    const index = entryArrays.findIndex(arr =>
      arr.findIndex(e =>
        e.price.symbol === entry.price.symbol &&
        new Date(e.price.regularMarketTime).toISOString().substr(0, 10) === entryDate
      ) !== -1);
    if (index === -1) {
      entryArrays.push([entry]);
    } else {
      entryArrays[index].push(entry);
    }
  }

  const dupes = entryArrays.filter(e => e.length > 1);

  console.log(entryArrays.length, dupes.length);

  for (const collection of dupes) {
    for (const entry of collection) {
      console.log(entry.price.symbol, entry.price.regularMarketTime);
    }
    console.log();
    for (let i = 1; i < collection.length; i++) {
      const query = new MySqlQuery('DELETE FROM single_day_data WHERE id=@id', dbconn, {
        parameters: {
          id: collection[i].id
        }
      });
      await query.executeNonQueryAsync();
      console.log(`${collection[i].id} deleted`);
    }
  }
}