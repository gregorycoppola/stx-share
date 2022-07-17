const axios = require('axios')
const fs = require('fs')

async function run_internal(db_file) {

    const blocks_result = await axios.get('https://stacks-node-api.mainnet.stacks.co/extended/v1/block')

    const blocks = blocks_result.data.results

    console.log({blocks})

    for (const block of blocks) {
        const block_string = JSON.stringify(block)
        console.log({block_string})


        fs.appendFileSync(db_file, block_string + '\n');
    }

    console.log({db_file})
}



TX_JSON_FNAME = process.argv[2]
console.log({TX_JSON_FNAME})

run_internal(TX_JSON_FNAME)