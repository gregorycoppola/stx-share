// Step 1:
// curl https://stacks-node-api.mainnet.stacks.co/extended/v1/block > ${FILE_NAME}

// Step 2:
// node download_blocks.js ${FILE_NAME}

const process = require('process')
const fs = require('fs')

TX_JSON_FNAME = process.argv[2]
console.log({TX_JSON_FNAME})

const contents = fs.readFileSync(TX_JSON_FNAME)
json_list = JSON.parse(contents).results


for (const json_item of json_list) {
    console.log({burn_block_time_iso: json_item.burn_block_time_iso})

    const date = new Date(json_item.burn_block_time_iso)
    console.log({date})
    
    const tx_size = json_item.txs.length
    console.log({tx_size})
}