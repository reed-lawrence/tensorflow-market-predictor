import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { IApiResult } from './main';
import { mean, std, round } from 'mathjs';

export function getData() {
  const ds: IApiResult[] = JSON.parse(fs.readFileSync('./storage/ds.json', { encoding: 'utf8' }));
  return ds;
}


export async function train() {
  const beta_vals: number[] = [];
  const trending_vals: number[] = [];
  const y_vals: number[] = [];

  const data = getData();
  for (const entry of data) {
    let yVal = 0;
    if (typeof entry.price.regularMarketDayHigh === 'number' && typeof entry.price.regularMarketOpen === 'number') {
      yVal = entry.price.regularMarketDayHigh - entry.price.regularMarketOpen;
    }
    // console.log(yVal);
    y_vals.push(yVal);

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
  }


  // Fit a quadratic function by learning the coefficients a, b, c.
  // const xs = tf.tensor1d([0, 1, 2, 3]);
  // const ys = tf.tensor1d([1.1, 5.9, 16.8, 33.9]);

  const ys = tf.tensor1d(y_vals);
  const beta = tf.tensor1d(beta_vals);
  const trending = tf.tensor1d(trending_vals);

  // beta
  const a = tf.scalar(Math.random()).variable();

  // trending
  const b = tf.scalar(Math.random()).variable();

  // constant adjuster
  const c = tf.scalar(Math.random()).variable();

  // y = a * x^2 + b * x + c
  // const f = (x: tf.Tensor1D) => a.mul(x.square()).add(b.mul(x)).add(c);

  // (high - open) = (beta * a) + (trending * b) + c
  const f = (beta: tf.Tensor1D, trending: tf.Tensor1D) => {
    const output = a.mul(beta)
      .add(b.mul(trending))
      .add(c);
    // console.log(output);
    return output;
  }

  const loss = (pred: any, label: any) => pred.sub(label).square().mean();

  const learningRate = 0.01;
  const optimizer = tf.train.sgd(learningRate);

  // Train the model.
  for (let i = 0; i < 100; i++) {
    optimizer.minimize(() => loss(f(beta, trending), ys));
  }

  // Make predictions.
  console.log(`a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
  const preds = f(beta, trending).dataSync();

  const diffs: number[] = [];
  const percents: number[] = [];
  preds.forEach((pred: number, i: number) => {
    const expected = pred;
    const actual = y_vals[i];
    const diff = (actual - expected);
    diffs.push(diff);

    let percent = 0;
    if (actual !== 0) {
      percent = diff / actual;
      percents.push(Math.abs(percent));
    }
    // console.log(`i: ${i}, pred: ${round(expected, 3)}, actual: ${round(actual, 3)}, diff: ${round(diff, 3)}, percent: ${round(percent, 3)}%`);
    console.log(`${round(expected, 3)},${round(actual, 3)}`);

  });
  console.log();
  const avgAbsPercent = round(mean(percents), 3) as number;
  console.log(`Avg absolute prediction variance: ${avgAbsPercent}%`);
  console.log(`Std Deviation: ${round(std(diffs), 3)}`);
  console.log(`Significant model fit: ${100 - avgAbsPercent}%`)

}

train().catch(err => {
  console.error(err);
});