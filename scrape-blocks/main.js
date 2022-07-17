const process = require('process')
const run_once = require('./run_once')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main(db_file) {
    while (true) {


        try {
            console.log('going to run once')
            await run_once.run_internal(db_file)
        } catch (e) {
            console.log({
                e
            })

            let date_ob = new Date();
            const sleep_time = 60 * 1000
            console.log(date_ob.toString() + `: sleeping afer error for ${sleep_time}ms`)
            await sleep(sleep_time)

        }
    }
}

TX_JSON_FNAME = process.argv[2]
console.log({TX_JSON_FNAME})

main(TX_JSON_FNAME)