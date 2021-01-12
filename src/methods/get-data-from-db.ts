import { IApiResult } from "../interfaces/api-result";
import { Connection } from "mysql";
import { MySqlQuery } from "../mysql/mysql-query";

export async function GetDataFromDb(dbconn: Connection) {
  const ds: IApiResult[] = [];

  const query = new MySqlQuery('SELECT id, data FROM single_day_data', dbconn);
  const rows = await query.executeQueryAsync();
  for (const row of rows.results) {
    const obj = JSON.parse(row.data);
    obj.id = row.id;
    ds.push(obj);
  }
  console.log(`Data entries: ${ds.length}`);
  return ds;
}