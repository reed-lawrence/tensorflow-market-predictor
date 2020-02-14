import { Subsample } from "../rank";

export function predict(sample: Subsample): number {

  // Percent change model
  // return (sample.beta * 0.43913936614990234) +
  //   (sample.trending * 0.2725888788700104) +
  //   (sample.shortRatio * 0.07221806049346924) +
  //   (sample.preMarketChange * -0.22439055144786835) +
  //   1.0478475093841553;

  // Raw delta model
  // return (sample.beta * 0.28961578011512756) +
  //   (sample.trending * 0.6951797604560852) +
  //   (sample.shortRatio * -0.009811404161155224) +
  //   (sample.preMarketChange * -0.45400524139404297) +
  //   0.45660850405693054;

  // Model for open < 30
  return (sample.beta * 0.0679028183221817) +
    (sample.trending * -0.02974301390349865) +
    (sample.shortRatio * 0.006339971907436848) +
    (sample.preMarketChange * -0.031536076217889786) +
    0.05815163627266884;
}