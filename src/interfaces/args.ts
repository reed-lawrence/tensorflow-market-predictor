export class Args {
  public get Rank() {
    return process.argv.indexOf('--rank') !== -1;
  }
}