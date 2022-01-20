const process = require('process')
const fullness = require('./fullness')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
    while(true) {
        const sleep_time = 60 * 1000
        console.log(`sleeping... ${sleep_time}`)
        await sleep(sleep_time)

        try {
            await fullness.run()
        } catch (e) {
            console.log({e})
        }
    }
}

main()
