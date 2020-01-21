import { Utils } from './utils';
import { IApiResult } from './interfaces/api-result';
import * as fs from 'fs';
import { predict } from './methods/predict';

export type Subsample = {
  symbol: string;
  highDelta: number; // Y
  beta: number;
  trending: number;
  shortRatio: number;
  preMarketChange: number;
  deltaPercent: number;
  open: number;
}

export async function rank() {
  const currentData: IApiResult[] = JSON.parse(fs.readFileSync('./storage/current-data.json', { encoding: 'utf8' }));
  const subsamples: Subsample[] = currentData.map(d => {
    let beta = 0, trending = 0, shortRatio = 0, preMarketChange = 0;
    if (typeof d.defaultKeyStatistics.beta === 'number') {
      beta = d.defaultKeyStatistics.beta;
    } else if (d.defaultKeyStatistics.beta && d.defaultKeyStatistics.beta.raw) {
      beta = d.defaultKeyStatistics.beta.raw;
    }

    if (typeof d.price.regularMarketPrice === 'number' && typeof d.price.regularMarketPreviousClose === 'number') {
      trending = d.price.regularMarketPrice - d.price.regularMarketPreviousClose;
    }

    if (d.defaultKeyStatistics.shortRatio && typeof d.defaultKeyStatistics.shortRatio === 'number') {
      shortRatio = d.defaultKeyStatistics.shortRatio;
    }

    if (d.price.preMarketChange && typeof d.price.preMarketChange === 'number') {
      preMarketChange = d.price.preMarketChange;
    }

    return {
      symbol: d.price.symbol,
      beta,
      trending,
      shortRatio,
      preMarketChange,
      highDelta: 0,
      deltaPercent: 0,
      open: typeof d.price.regularMarketOpen === 'number' ? d.price.regularMarketOpen : d.price.regularMarketOpen.raw
    }
  });

  for (const sample of subsamples) {
    sample.highDelta = predict(sample);
    sample.deltaPercent = (sample.highDelta / sample.open) * 100;
  }

  subsamples.sort((a, b) => a.highDelta < b.highDelta ? 1 : a.highDelta > b.highDelta ? -1 : 0);
  // console.log(subsamples);

  console.log(subsamples.filter(s => s.open < 30));
  return;
}

rank().then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(err);
})

