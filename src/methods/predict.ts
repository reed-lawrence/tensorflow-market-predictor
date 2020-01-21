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
  return (sample.beta * 0.008290164172649384) +
    (sample.trending * 0.17112819850444794) +
    (sample.shortRatio * 0.017354385927319527) +
    (sample.preMarketChange * 0.0010310141369700432) +
    0.1135389432311058;
}