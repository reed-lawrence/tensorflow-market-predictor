import { getData } from "./methods/get-data";
import { Utils } from "./utils";


export async function test() {
  const ds = await getData();
  const yesterdaysEntry = Utils.getFromDate(ds[250], 1, ds);
  console.log(yesterdaysEntry?.price.regularMarketTime);
}

test().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.error(err);
})