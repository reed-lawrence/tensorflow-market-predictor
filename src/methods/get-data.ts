import { IApiResult } from "../interfaces/api-result";
import { createConnection } from "mysql";
import { MySqlQuery, queryFormat } from "../mysql/mysql-query";

export async function getData() {
  const ds: IApiResult[] = [];

  const dbconn = createConnection({
    host: 'localhost',
    user: 'root',
    password: '2v&kJe^jf%!&jG>WiwieFReVLEeydmqGWV.o)mvp83W7,mz]rrv!rq3!C7hL6o+h',
    database: 'market_data',
    queryFormat
  });

  const query = new MySqlQuery('SELECT id, data FROM single_day_data', dbconn);
  const rows = await query.executeQueryAsync();
  for (const row of rows.results) {
    const obj = JSON.parse(row.data);
    obj.id = row.id;
    ds.push(obj);
  }
  console.log(`Data entries: ${ds.length}`);
  dbconn.end();
  return ds;
}