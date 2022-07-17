const process = require('process')
const fs = require('fs')

TX_JSON_FNAME = process.argv[2]
// console.log({TX_JSON_FNAME})


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

const start_time = new Date('2022-06-29T20:15:43.181Z')
const end_time = new Date('2022-07-05T23:59:47.652Z')

var tuples = []
for (var json_index = 0; json_index < json_list.length; json_index += 1) {

    const json_item = json_list[json_index]
    // console.log({burn_block_time_iso: json_item.burn_block_time_iso})

    const timestamp = new Date(json_item.burn_block_time_iso)

    if (start_time <= timestamp&& timestamp <= end_time) {
        tuples.push({timestamp, tx_per_block: json_item.txs.length})
        // console.log({timestamp, tx_per_block: json_item.txs.length})

    }
}



console.log(JSON.stringify(tuples))