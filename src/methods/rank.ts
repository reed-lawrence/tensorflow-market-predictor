import { Utils } from '../utils';
import { IApiResult } from '../interfaces/api-result';
import * as fs from 'fs';
import { predict } from './predict';
import { GetDataFromDb } from './get-data-from-db';
import { Connection } from 'mysql';
import { SubsampleMap } from './train';

export async function Rank(data: IApiResult[], dbconn: Connection) {
  const historicalData: IApiResult[] = await GetDataFromDb(dbconn);
  const currentData: IApiResult[] = data;
  const subsamples = SubsampleMap(currentData, historicalData, 'premarket');

  for (const sample of subsamples) {
    sample.deltaHigh = predict(sample);
  }

  subsamples.sort((a, b) => a.deltaHigh < b.deltaHigh ? 1 : a.deltaHigh > b.deltaHigh ? -1 : 0);

  const results = subsamples;
  for (let i = 0; i < 10; i++) {
    console.log(results[i]);
  }
  return;
}

