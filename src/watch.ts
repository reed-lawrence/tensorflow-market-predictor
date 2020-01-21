export async function watch() {
  console.log(process.argv);

  const toWatch: string[] = [];

  for (let i = 2; i < process.argv.length; i++) {
    toWatch.push(process.argv[i]);
  }
  console.log(toWatch);
}

watch().then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(err);
})