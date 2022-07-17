// Step 1:
// curl https://stacks-node-api.mainnet.stacks.co/extended/v1/block > ${FILE_NAME}

// Step 2:
// node download_blocks.js ${FILE_NAME}

const process = require('process')
const fs = require('fs')

TX_JSON_FNAME = process.argv[2]
console.log({TX_JSON_FNAME})


const contents = fs.readFileSync(TX_JSON_FNAME, 'utf8')
const lines = contents.split('\n')
var blocks = []
for (const line of lines) {
    if (line == '') {
        continue
    }
    blocks.push(JSON.parse(line))
}
const json_list = blocks // redundant variable
json_list.reverse()

WINDOW_SIZE = 6

const start_timestamp = new Date('2022-06-29T20:29:00.000Z')
const end_timestamp = new Date('2022-07-02T16:40:51.000Z')

var max_tps = 0
var sum_tps = 0
var total_tps = 0
for (var json_index = 0; json_index < json_list.length; json_index += 1) {

    const json_item = json_list[json_index]
    console.log({burn_block_time_iso: json_item.burn_block_time_iso})

    const timestamp = new Date(json_item.burn_block_time_iso)
    console.log({date: timestamp})
    
    if (timestamp < start_timestamp || timestamp > end_timestamp) {
        continue
        
    }
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

    const last_time = new Date(json_list[json_index - WINDOW_SIZE].burn_block_time_iso)
    const time_diff_seconds = (timestamp - last_time) / 1000
    console.log({sum})
    console.log({time_diff_seconds})

    const tps = sum / time_diff_seconds
    console.log({tps})

    if (tps > max_tps) {
        max_tps = tps
    }

    sum_tps += tps
    total_tps += 1
}

const avg_tps = sum_tps / total_tps
console.log({max_tps})
console.log({avg_tps})