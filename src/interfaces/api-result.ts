import { ISummaryDetail } from "./summary-detail";

import { IDefaultKeyStatistics } from "./default-key-statistics";

import { IEarnings } from "./earnings";

import { IPrice } from "./price";

export type IApiResult = { summaryDetail: ISummaryDetail, defaultKeyStatistics: IDefaultKeyStatistics, earnings: IEarnings, price: IPrice };
