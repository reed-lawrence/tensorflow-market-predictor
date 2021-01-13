import * as fs from 'fs';
import { mean, round, std } from 'mathjs';
import { Connection } from 'mysql';

import * as tf from '@tensorflow/tfjs-node';

import { IApiResult } from '../interfaces/api-result';
import { Utils } from '../utils';
import { tensor } from '@tensorflow/tfjs-node';

export type Subsample = {
  symbol: string;
  deltaHigh: number;
  beta: number;
  trending: number;
  shortRatio: number;
  preMarketChange: number;
  open: number;
}

export type TensorFunc = (o: IApiResult) => number;
export class Tensor {
  func: TensorFunc;
  name: string;

  constructor(name: string, func: TensorFunc) {
    this.name = name;
    this.func = func;
  }
};



export class Optimizer {

  predict: Tensor;
  tensors: Tensor[] = [];
  constant: number = 0;
  learningRate: number = 0;
  iterations: number = 0;
  data: IApiResult[] = [];

  constructor(options: { data: IApiResult[]; predict: Tensor; tensors: Tensor[]; learningRate: number; iterations: number; }) {
    this.predict = options.predict;
    this.tensors = options.tensors;
    this.learningRate = options.learningRate;
    this.iterations = options.iterations;
    this.data = options.data;
  }

  Train() {
    const tensorVals: number[] = [];
    const best = { value: 1000, tensors: tensorVals };
    const tensorRange = 10;

    // Initialize the tensor values to start at a very negative value
    for (let i = 0; i < this.tensors.length; i++) {
      tensorVals.push(0 - tensorRange);
    }

    const runPrediction = (obj: IApiResult) => {
      let prediction = 0;
      for (let i = 0; i < this.tensors.length; i++) {
        prediction += this.tensors[i].func(obj) * tensorVals[i];
      }
      return prediction;
    }

    const maxIterations = 1 / this.learningRate;

    // First individually test each tensor for significance
    for (let t = 0; t < this.tensors.length; t++) {

      const bestSingleTensor = {
        value: tensorRange,
        avgLoss: tensorRange
      };

      // Iterate as many times as necessary until the range is fulfilled
      // Ex. -10,000 -> 10,000
      while (tensorVals[t] < tensorRange) {

        const losses: number[] = [];

        for (let i = 0; i < this.data.length; i++) {

          const prediction = tensorVals[t] * this.tensors[t].func(this.data[i]);
          const actual = this.predict.func(this.data[i]);
          const loss = actual - prediction;
          losses.push(loss);
        }

        const avg = Utils.mean(losses);
        // console.log(`Value: ${tensorVals[t]} | Avg: ${avg}`);
        if (Math.abs(avg) < Math.abs(bestSingleTensor.avgLoss)) {
          bestSingleTensor.avgLoss = avg;
          bestSingleTensor.value = tensorVals[t];
          // console.log(`New best loss: ${bestSingleTensor}`);
        }

        tensorVals[t] += this.learningRate;
      }

      tensorVals[t] = bestSingleTensor.value;

    }

    for (let i = 0; i < this.tensors.length; i++) {
      console.log(`Tensor: ${this.tensors[i].name} ${tensorVals[i]}`);
    }



  }


}

export async function TrainDynamic(data: IApiResult[]) {

  const trainer = new Optimizer({
    data,
    iterations: 1000,
    learningRate: 0.0001,
    tensors: [
      new Tensor('shortRatio', (o) => {
        if (o.defaultKeyStatistics && o.defaultKeyStatistics.shortRatio && typeof o.defaultKeyStatistics.shortRatio === 'number') {
          return o.defaultKeyStatistics.shortRatio;
        } else {
          return 0;
        }
      })
    ],
    predict: new Tensor('Delta High', (o) => {
      if (typeof o.price.regularMarketOpen === 'number' && typeof o.price.regularMarketDayHigh === 'number') {
        return (o.price.regularMarketDayHigh - o.price.regularMarketOpen) / o.price.regularMarketOpen;
      } else {
        return 0;
      }
    })
  });

  trainer.Train();

}