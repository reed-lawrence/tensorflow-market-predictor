import { Connection } from "mysql";
import { IApiResult } from "../interfaces/api-result";
import { GetDataFromDb } from "./get-data-from-db";

export async function ValidateData(data: IApiResult[], dbconn: Connection) {
  const formatDate = (entry: IApiResult) => new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);

  const dbData = await GetDataFromDb(dbconn);
  let allValid = true;
  if (data && data.length) {

    for (const entry of data) {

      const index = dbData.findIndex(e => e.price.symbol === entry.price.symbol && formatDate(e) === formatDate(entry));
      if (index === -1) {
        console.error(`Entry not found: ${entry.price.symbol}`);
        allValid = false;
      }

    }

    console.log(`Entries validated: ${allValid}`);
  }
}