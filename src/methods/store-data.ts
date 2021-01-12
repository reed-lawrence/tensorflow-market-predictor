import { Connection } from "mysql";
import { IApiResult } from "../interfaces/api-result";
import { IChart } from "../interfaces/chart";
import { MySqlQuery } from "../mysql/mysql-query";

export async function StoreData(data: IApiResult[], chartData: IChart[], dbconn: Connection) {
  console.log('Writing to sql...');

  if (data && data.length) {

    for (const entry of data) {
      console.log(`Inserting ${entry.price.symbol}...`);
      let query = new MySqlQuery('INSERT INTO single_day_data (data) VALUES (@data)', dbconn, {
        parameters: {
          data: JSON.stringify(entry)
        }
      });

      await query.executeNonQueryAsync();

      console.clear();
    }

  }

  if (chartData && chartData.length) {

    for (const entry of chartData) {
      console.log(`Inserting chart data for ${entry.result[0].meta.symbol}...`);
      const query = new MySqlQuery('INSERT INTO charts (data) VALUES (@data)', dbconn, {
        parameters: {
          data: JSON.stringify(entry)
        }
      });

      await query.executeNonQueryAsync();
      console.clear();
    }

  }

}