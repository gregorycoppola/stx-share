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
json_list.reverse()

WINDOW_SIZE = 6

for (var json_index = 0; json_index < json_list.length; json_index += 1) {

    const json_item = json_list[json_index]
    console.log({burn_block_time_iso: json_item.burn_block_time_iso})

    const date = new Date(json_item.burn_block_time_iso)
    console.log({date})
    
    const tx_size = json_item.txs.length
    console.log({tx_size})

    if (json_index - WINDOW_SIZE < 0) {
        continue;
    }

    var sum = 0;
    for (var count_index = 0; count_index < WINDOW_SIZE; count_index += 1) {
        const count_item = json_list[json_index - count_index]
        const count_itemtx_size = count_item.txs.length
        sum += count_itemtx_size
        const count_itemdate = new Date(count_item.burn_block_time_iso)
        console.log({count_itemdate}) 
        console.log({count_itemtx_size})
    }
    console.log({sum})

}