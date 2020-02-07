"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function predict(sample) {
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
    return (sample.beta * 0.0620037205517292) +
        (sample.trending * -0.029805989935994148) +
        (sample.shortRatio * 0.005900632124394178) +
        (sample.preMarketChange * -0.030230507254600525) +
        0.05816923454403877;
}
exports.predict = predict;
