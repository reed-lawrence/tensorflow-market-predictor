import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { IApiResult } from './main';
import { mean, std, round } from 'mathjs';

export function getData() {
  const ds: IApiResult[] = JSON.parse(fs.readFileSync('./storage/ds.json', { encoding: 'utf8' }));
  return ds;
}


export async function train() {
  console.clear();
  const beta_vals: number[] = [];
  const trending_vals: number[] = [];
  const y_vals: number[] = [];
  const shortRatio_vals: number[] = [];
  const preMarketChange_vals: number[] = [];
  const open_vals: number[] = [];

  const data = getData();
  for (const entry of data) {
    let open = 0;
    let yVal = 0;
    if (typeof entry.price.regularMarketDayHigh === 'number' && typeof entry.price.regularMarketOpen === 'number') {
      yVal = entry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
      open = entry.price.regularMarketOpen;

      // console.log(yVal);
      y_vals.push(yVal);
      open_vals.push(open);

      let beta = 0;
      if (entry.defaultKeyStatistics.beta) {
        if (typeof entry.defaultKeyStatistics.beta === 'number') {
          beta = entry.defaultKeyStatistics.beta;
        } else {
          beta = entry.defaultKeyStatistics.beta.raw || 0;
        }
      }

      // console.log(beta);
      beta_vals.push(beta);

      let trending = 0;
      if (typeof entry.price.regularMarketPrice === 'number' && typeof entry.price.regularMarketPreviousClose === 'number') {
        trending = entry.price.regularMarketPrice - entry.price.regularMarketPreviousClose;
      }
      // console.log(trending)
      trending_vals.push(trending);

      let shortRatio = 0;
      if (entry.defaultKeyStatistics.shortRatio && typeof entry.defaultKeyStatistics.shortRatio === 'number') {
        shortRatio = entry.defaultKeyStatistics.shortRatio;
      }
      shortRatio_vals.push(shortRatio);

      let preMarketChange = 0;
      if (entry.price.preMarketChange && typeof entry.price.preMarketChange === 'number') {
        preMarketChange = entry.price.preMarketChange;
      }
      preMarketChange_vals.push(preMarketChange);
    }
  }

  // Fit a quadratic function by learning the coefficients a, b, c.
  // const xs = tf.tensor1d([0, 1, 2, 3]);
  // const ys = tf.tensor1d([1.1, 5.9, 16.8, 33.9]);

  const ys = tf.tensor1d(y_vals);
  const beta = tf.tensor1d(beta_vals);
  const trending = tf.tensor1d(trending_vals);
  const shortRatio = tf.tensor1d(shortRatio_vals);
  const preMarketChange = tf.tensor1d(preMarketChange_vals);
  const open = tf.tensor1d(open_vals);


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
  const f = (_beta: tf.Tensor1D, _trending: tf.Tensor1D, _shortRatio: tf.Tensor1D, _preMarketChange: tf.Tensor1D, _open: tf.Tensor1D) => {
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
    optimizer.minimize(() => loss(f(beta, trending, shortRatio, preMarketChange, open), ys));
  }

  // Make predictions.
  const preds = f(beta, trending, shortRatio, preMarketChange, open).dataSync();

  const diffs: number[] = [];
  const percents: number[] = [];
  preds.forEach((pred: number, i: number) => {
    const expected = pred;
    const actual = y_vals[i];
    const diff = (actual - expected);
    diffs.push(diff);

    let percent = 0;
    if (actual !== 0) {
      percent = (diff / Math.abs(expected)) * 100;
      percents.push(Math.abs(percent));
    }
    console.log(`i: ${i}, pred: ${round(expected, 3)}, actual: ${round(actual, 3)}, diff: ${round(diff, 3)}, percent: ${round(percent, 3)}%`);
    // console.log(`${round(expected, 3)},${round(actual, 3)}`);

  });
  console.log();
  const avgAbsPercent = round(mean(percents), 3) as number;
  console.log(`a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
  console.log(`Avg abs difference: $${round(mean(diffs.map(d => Math.abs(d))), 2)}`)
  console.log(`Avg absolute prediction variance: ${avgAbsPercent}%`);
  console.log(`Std Deviation: ${round(std(diffs), 3)}`);
  console.log(`Significant model fit: ${100 - avgAbsPercent}%`);

}

train().catch(err => {
  console.error(err);
});