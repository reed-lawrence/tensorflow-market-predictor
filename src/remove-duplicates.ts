import { getData } from "./methods/get-data";

import { IApiResult } from "./interfaces/api-result";

import { createConnection } from "mysql";

import { MySqlQuery, queryFormat } from "./mysql/mysql-query";

export async function dedupe() {
  const data = await getData();
  for (let i = 0; i < 45; i++) {
    const date = new Date(2020, 0, i).toISOString().substr(0, 10);
    const dayData = data.filter(entry => new Date(entry.price.regularMarketTime).toISOString().substr(0, 10) == date);
    console.log(date, dayData.length);
  }

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


  const dbconn = createConnection({
    host: 'localhost',
    user: 'root',
    password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
    database: 'market_data',
    queryFormat
  });

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

  dbconn.end();
}

dedupe().then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(err);
})