const process = require('process')
const fullness = require('./fullness')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    while (true) {
        let date_ob = new Date();
        const sleep_time = 60 * 1000
        console.log(date_ob.toString() + `: sleeping for ${sleep_time}ms`)
        await sleep(sleep_time)

        try {
            await fullness.run()
        } catch (e) {
            console.log({
                e
            })
        }
    }
}

main()