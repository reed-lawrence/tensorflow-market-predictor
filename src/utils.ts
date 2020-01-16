import { symbols } from './symbols';
import { IApiResult } from './interfaces/api-result';
export class Utils {
  public static mean(arr: number[]) {
    if (arr.length === 0) {
      throw new Error('Cannot find mean of empty array');
    }
    let total = 0;
    arr.forEach(num => total += num);
    return total / arr.length;
  }

  public static distinctSymbols() {
    const output: string[] = [];
    for (const symbol of symbols) {
      if (output.findIndex(s => s === symbol) === -1) {
        output.push(symbol);
      }
    }
    return output;
  }

  public static getFromDate(target: IApiResult, n: number, collection: IApiResult[]) {
    const targetDate = new Date(target.price.regularMarketTime);
    // console.log(`From date: ${targetDate.toISOString().substr(0, 10)}`);
    const newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10);
    // console.log(`Looking for date ${newDate}`);
    for (const entry of collection) {
      const entryDate = new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);
      if (entryDate === newDate && target.price.symbol === entry.price.symbol) {
        return entry;
      }
    }
    return;
  }
}