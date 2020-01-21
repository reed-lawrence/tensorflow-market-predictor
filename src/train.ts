import * as tf from '@tensorflow/tfjs-node';
import { mean, std, round } from 'mathjs';
import { getData } from './methods/get-data';
import { Utils } from './utils';



export type Subsample = {
  symbol: string;
  deltaHigh: number;
  beta: number;
  trending: number;
  shortRatio: number;
  preMarketChange: number;
  open: number;
}

export async function train() {
  console.clear();

  const data = await getData();

  const subsamples: Subsample[] = data.map(entry => {
    let deltaHigh = 0, beta = 0, trending = 0, shortRatio = 0, preMarketChange = 0, open = 0, symbol = entry.price.symbol;

    // Delta high that predicts next day data
    // const nextDayEntry = Utils.getFromDate(entry, 1, data);
    // if (
    //   nextDayEntry &&
    //   typeof nextDayEntry.price.regularMarketDayHigh === 'number' &&
    //   typeof entry.price.regularMarketOpen === 'number'
    // ) {
    //   deltaHigh = nextDayEntry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
    // }

    // Delta high that predicts current day data
    if (typeof entry.price.regularMarketOpen === 'number' && typeof entry.price.regularMarketDayHigh === 'number') {
      deltaHigh = entry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
      open = entry.price.regularMarketOpen;
    }

    // Delta high that predicts current day data based on percent change
    // if (typeof entry.price.regularMarketOpen === 'number' && typeof entry.price.regularMarketDayHigh === 'number') {
    //   deltaHigh = 100 - ((entry.price.regularMarketOpen / entry.price.regularMarketDayHigh) * 100);
    // }

    if (entry.defaultKeyStatistics.beta) {
      if (typeof entry.defaultKeyStatistics.beta === 'number') {
        beta = entry.defaultKeyStatistics.beta;
      } else {
        beta = entry.defaultKeyStatistics.beta.raw || 0;
      }
    }

    if (typeof entry.price.regularMarketPrice === 'number' && typeof entry.price.regularMarketPreviousClose === 'number') {
      trending = entry.price.regularMarketPrice - entry.price.regularMarketPreviousClose;
    }

    if (entry.defaultKeyStatistics.shortRatio && typeof entry.defaultKeyStatistics.shortRatio === 'number') {
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

  // const filteredData = subsamples.filter(sample => sample.beta && sample.deltaHigh && sample.preMarketChange && sample.shortRatio && sample.trending);
  const filteredData = subsamples.filter(sample => sample.deltaHigh && sample.open && sample.open < 30);
  // const filteredData = subsamples;

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

  const learningRate = 0.001;
  const optimizer = tf.train.sgd(learningRate);

  // Train the model.
  for (let i = 0; i < 1000; i++) {
    optimizer.minimize(() => loss(f(beta, trending, shortRatio, preMarketChange), ys));
  }

  // Make predictions.
  const preds = f(beta, trending, shortRatio, preMarketChange).dataSync();

  const diffs: number[] = [];
  preds.forEach((pred: number, i: number) => {
    const expected = pred;
    const actual = filteredData[i].deltaHigh;
    const diff = (actual - expected);
    diffs.push(diff);

    let percent = 0;
    if (actual !== 0) {
      percent = (diff / Math.abs(expected)) * 100;
    }
    console.log(`i: ${i}, pred: ${round(expected, 3)}, actual: ${round(actual, 3)}, diff: ${round(diff, 3)}, percent: ${round(percent, 3)}%`);
    // console.log(`${round(expected, 3)},${round(actual, 3)}`);

  });
  console.log();
  console.log(`beta: ${a.dataSync()}, trending: ${b.dataSync()}, shortRatio: ${s.dataSync()}, preMarketChange: ${p.dataSync()}, c: ${c.dataSync()}`);
  console.log(`Avg abs difference: ${round(mean(diffs.map(d => Math.abs(d))), 2)}`);
  console.log(`Std Deviation: ${round(std(diffs), 3)}`);
  console.log(`Avg open: ${mean(filteredData.map(d => d.open))}`);
  return;
}

train().then(() => { console.log('Done!'); }).catch(err => {
  console.error(err);
});