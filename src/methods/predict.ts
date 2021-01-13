import { IModel, Subsample } from "./train";
import * as fs from 'fs';

export function predict(sample: Subsample): number {

  const model: IModel = JSON.parse(fs.readFileSync('./storage/training_model.json', { encoding: 'utf8' }));

  return (sample.beta * model.beta) +
    (sample.trending * model.trending) +
    (sample.shortRatio * model.shortRatio) +
    (sample.preMarketChange * model.preMarketChange) +
    model.c;
}