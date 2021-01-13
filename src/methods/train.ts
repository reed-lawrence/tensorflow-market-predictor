import * as fs from 'fs';
import { filter, mean, median, mod, mode, round, std } from 'mathjs';
import { Connection } from 'mysql';

import * as tf from '@tensorflow/tfjs-node';

import { IApiResult } from '../interfaces/api-result';
import { Utils } from '../utils';

export interface Subsample {
  symbol: string;
  deltaHigh: number;
  beta: number;
  trending: number;
  shortRatio: number;
  preMarketChange: number;
  open: number;
}

export interface IModel {
  beta: number;
  trending: number;
  shortRatio: number;
  preMarketChange: number;
  c: number;
}

export function SubsampleMap(data: IApiResult[], historicalData: IApiResult[] = data, stage: 'premarket' | 'postmarket' = 'postmarket') {

  console.log(`SubsampleMap stage: ${stage}`);
  console.log(`SubsampleMap targetData: ${data.length} entries`);
  console.log(`SubsampleMap historicalData: ${historicalData.length} entries`);

  var subsamples: Partial<Subsample>[] = data.map(entry => {

    let deltaHigh: number | undefined;
    let beta: number | undefined;
    let trending: number | undefined;
    let shortRatio: number | undefined;
    let preMarketChange: number | undefined;
    let open: number | undefined;
    let symbol = entry.price.symbol;

    const prevDayData = Utils.getFromDate(entry, -1, historicalData);

    // Delta high that predicts current day data as a percentile of the stock price
    if (typeof entry.price.regularMarketOpen === 'number' && typeof entry.price.regularMarketDayHigh === 'number') {
      deltaHigh = ((entry.price.regularMarketDayHigh - entry.price.regularMarketOpen) / entry.price.regularMarketOpen) * 100;
      open = entry.price.regularMarketOpen;
    }

    if (entry.defaultKeyStatistics && entry.defaultKeyStatistics.beta) {
      if (typeof entry.defaultKeyStatistics.beta === 'number') {
        beta = entry.defaultKeyStatistics.beta;
      } else {
        beta = entry.defaultKeyStatistics.beta.raw || undefined;
      }
    }

    // Trending relies on previous day data
    if (prevDayData && prevDayData.price.regularMarketPreviousClose) {
      if (typeof prevDayData.price.regularMarketPreviousClose === 'number') {

        if (stage === 'premarket') {

          // For pre-market data, use regular Market Price as it was the last closing price
          if (typeof entry.price.regularMarketPrice === 'number') {
            trending = entry.price.regularMarketPrice - prevDayData.price.regularMarketPreviousClose;
          }

        } else {

          if (entry.price.regularMarketPreviousClose && typeof entry.price.regularMarketPreviousClose === 'number') {
            trending = entry.price.regularMarketPreviousClose - prevDayData.price.regularMarketPreviousClose;
          }

        }

      }
    }

    if (entry.defaultKeyStatistics && entry.defaultKeyStatistics.shortRatio && typeof entry.defaultKeyStatistics.shortRatio === 'number') {
      shortRatio = entry.defaultKeyStatistics.shortRatio;
    }

    if (entry.price.preMarketChange && typeof entry.price.preMarketChange === 'number') {
      preMarketChange = entry.price.preMarketChange;
    }

    return {
      deltaHigh,
      beta,
      trending,
      shortRatio,
      preMarketChange,
      symbol,
      open
    }
  });

  const filterFn: (o: Partial<Subsample>) => boolean = (o: Partial<Subsample>) => {
    const exists = (o: any) => o !== null && o !== undefined;

    return exists(o.deltaHigh) &&
      exists(o.open) && typeof o.open === 'number' && o.open <= 100 &&
      exists(o.shortRatio) &&
      exists(o.beta) &&
      exists(o.trending) &&
      exists(o.preMarketChange);
  };

  return subsamples.filter(o => filterFn(o)) as Subsample[];

}

export async function Train(data: IApiResult[], dbconn: Connection) {
  console.clear();

  const subsamples = SubsampleMap(data);

  const filteredData = subsamples.filter(o => o);

  // console.log(filteredData);

  console.log(`Training data length: ${filteredData.length}`);
  const ys = tf.tensor1d(filteredData.map(o => o.deltaHigh));
  const beta = tf.tensor1d(filteredData.map(o => o.beta));
  const trending = tf.tensor1d(filteredData.map(o => o.trending));
  const shortRatio = tf.tensor1d(filteredData.map(o => o.shortRatio));
  const preMarketChange = tf.tensor1d(filteredData.map(o => o.preMarketChange));


  // beta
  const a = tf.scalar(0).variable();

  // trending
  const b = tf.scalar(0).variable();

  // constant adjuster
  const c = tf.scalar(0).variable();

  // short ratio - not very significant
  const s = tf.scalar(0).variable();

  // pre market change
  const p = tf.scalar(0).variable();

  // open
  const o = tf.scalar(0).variable();

  // y = a * x^2 + b * x + c
  // const f = (x: tf.Tensor1D) => a.mul(x.square()).add(b.mul(x)).add(c);

  // (high - open) = (beta * a) + (trending * b) + c
  const f = (_beta: tf.Tensor1D, _trending: tf.Tensor1D, _shortRatio: tf.Tensor1D, _preMarketChange: tf.Tensor1D) => {
    const output = a.mul(_beta)
      .add(b.mul(_trending))
      .add(s.mul(_shortRatio))
      .add(p.mul(_preMarketChange))
      .add(c);
    // console.log(output);
    return output;
  }

  const loss = (pred: any, label: any) => pred.sub(label).square().mean();

  const learningRate = 0.00001;
  const optimizer = tf.train.sgd(learningRate);

  // Train the model.
  for (let i = 0; i < 10000; i++) {
    optimizer.minimize(() => loss(f(beta, trending, shortRatio, preMarketChange), ys));
  }

  // Make predictions.
  const preds = f(beta, trending, shortRatio, preMarketChange).dataSync();

  const diffs: number[] = [];
  const resultsArray: { actual: number; expected: number }[] = []
  preds.forEach((pred: number, i: number) => {
    const expected = pred;
    const actual = filteredData[i].deltaHigh;
    const diff = (actual - expected);
    diffs.push(diff);

    let percent = 0;
    if (actual !== 0) {
      percent = (diff / Math.abs(expected)) * 100;
    }
    // console.log(`i: ${i}, pred: ${round(expected, 3)}, actual: ${round(actual, 3)}, diff: ${round(diff, 3)}`);
    // console.log(`${round(expected, 3)},${round(actual, 3)}`);
    resultsArray.push({ actual, expected });

  });

  const csvString = Utils.toCsvString(resultsArray, (res) => [res.actual, res.expected]);
  fs.writeFileSync('./storage/training_results.csv', csvString, { encoding: 'utf8' });
  console.log();

  const model: IModel = {
    beta: a.dataSync()[0],
    trending: b.dataSync()[0],
    shortRatio: s.dataSync()[0],
    preMarketChange: p.dataSync()[0],
    c: c.dataSync()[0]
  };
  fs.writeFileSync('./storage/training_model.json', JSON.stringify(model), { encoding: 'utf8' });

  console.log(`beta: ${model.beta}, trending: ${model.trending}, shortRatio: ${model.shortRatio}, preMarketChange: ${model.preMarketChange}, c: ${model.c}`);
  console.log(`Avg abs difference: ${round(mean(diffs.map(d => Math.abs(d))), 2)}`);
  console.log(`Std Deviation: ${round(std(diffs), 3)}`);
  console.log(`Avg open: ${mean(filteredData.map(d => d.open))}`);

  return;
}