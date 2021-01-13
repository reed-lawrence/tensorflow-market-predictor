import { symbols } from './symbols';
import { IApiResult } from './interfaces/api-result';

type MatchFor = 'regularMarketTime' | 'preMarketTime';

export class Utils {
  public static mean(arr: number[]) {
    if (arr.length === 0) {
      throw new Error('Cannot find mean of empty array');
    }
    let total = 0;
    arr.forEach(num => total += num);
    return total / arr.length;
  }

  public static distinct<T, U>(arr: T[], predicate: (o: T) => U): U[] {
    const output: U[] = [];
    for (const obj of arr) {
      const result = predicate(obj);
      if (output.findIndex(o => o === result) === -1) {
        output.push(result);
      }
    }
    return output;
  };

  public static getFromDate(target: IApiResult, n: number, collection: IApiResult[], targetMatchFor: MatchFor = 'regularMarketTime', collectionMatchFor: MatchFor = 'regularMarketTime') {
    if (n === 0) {
      throw new Error('n should not be 0 in getFromDate');
    }

    if (!target.price[targetMatchFor]) {
      throw new Error(`No key matching price.${targetMatchFor} in ${target.price.symbol}`);
    }

    // console.log(target.price);
    const d = Utils.toSimpleDate(target.price[targetMatchFor])
    const targetDate = d.value;
    // console.log(`From date: ${d.str}`);

    // const newDate = new Date(targetDate.setDate(targetDate.getDate() + n)).toISOString().substr(0, 10)


    const newDateStr = this.getFromDateStr(targetDate, n);

    // console.log(`Looking for date ${newDateStr}`);
    for (const entry of collection) {
      if (target.price.symbol === entry.price.symbol) {

        if (!entry.price[collectionMatchFor]) {
          throw new Error(`No key matching price.${collectionMatchFor} in ${entry.price.symbol}`);
        }

        const entryDateStr = Utils.toSimpleDate(entry.price[collectionMatchFor]).str;

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
    if (adjustedDate.getDay() === 0) {

      adjustedDate.setDate(adjustedDate.getDate() - 2);

    } else if (adjustedDate.getDay() === 6) {

      adjustedDate.setDate(adjustedDate.getDate() - 1);

    }

    return adjustedDate.toISOString().substr(0, 10);
  }

  public static toSimpleDate(isoString: string) {
    if (isoString) {
      try {
        const parsed = isoString.split('T')[0];
        const split = parsed.split('-');
        const year = parseInt(split[0]);
        const month = parseInt(split[1]);
        const date = parseInt(split[2]);
        const value = new Date(year, month, date);
        const str = value.toISOString().substr(0, 10);
        return {
          str,
          year,
          month,
          date,
          value
        };
      } catch { }
    }

    throw new Error(`Cannot parse date: ${isoString}`);
  }

  public static toCsvString<T, U>(objs: T[], map: (o: T) => U[]) {
    let output = '';
    for (const obj of objs) {
      output += map(obj).join(',');
      output += '\r\n';
    }
    return output;
  }

}