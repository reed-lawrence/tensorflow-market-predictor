import { main } from "./main";

main().then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(err);
});