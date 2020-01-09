import { symbols } from './symbols';
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
}