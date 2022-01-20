const process = require('process')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
    while(true) {
        console.log("sleeping...")
        await sleep(1000)
    }
}

main()
