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
    if (n === 0) {
      throw new Error('n should not be 0 in getFromDate');
    }

    const targetDate = new Date(target.price.regularMarketTime);
    // console.log(`From date: ${targetDate.toISOString().substr(0, 10)}`);

    // const newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10)


    const newDateStr = this.getFromDateStr(targetDate, n);

    // console.log(`Looking for date ${newDate}`);
    for (const entry of collection) {
      if (target.price.symbol === entry.price.symbol) {
        const entryDateStr = new Date(entry.price.regularMarketTime).toISOString().substr(0, 10);
        if (entryDateStr === newDateStr) {
          return entry;
        }
      }
    }
    return;
  }

  public static getFromDateStr(targetDate: Date, n: number) {
    if (!n) {
      throw new Error('n must be non zero in getFromDateStr');
    }

    // Date should only consider M-F days
    let adjustedDate = new Date(targetDate.setDate(targetDate.getDate() + n));

    // If the adjusted date is a sunday or saturday
    if (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6) {

      // Adjust the date until it is is a weekday
      for (let i = 0; i < 2; i++) {

        // If looking backwards - it should move the date backwards (Sunday -> Friday)
        if (n < 0) {
          adjustedDate = new Date(adjustedDate.setDate(adjustedDate.getDate() - 1));
        } else {
          adjustedDate = new Date(adjustedDate.setDate(adjustedDate.getDate() + 1));
        }

        // If the date is now valid, exit the loop;
        if (adjustedDate.getDay() > 0 && adjustedDate.getDay() < 6) {
          i = 2;
        }
      }
    }
    return adjustedDate.toISOString().substr(0, 10);
  }

}