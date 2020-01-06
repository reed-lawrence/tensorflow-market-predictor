export class Utils {
  public static mean(arr: number[]) {
    if (arr.length === 0) {
      throw new Error('Cannot find mean of empty array');
    }
    let total = 0;
    arr.forEach(num => total += num);
    return total / arr.length;
  }
}