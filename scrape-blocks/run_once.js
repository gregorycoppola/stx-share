const axios = require('axios')
const fs = require('fs')
const assert = require('assert')

async function read_blocks() {
    const blocks_result = await axios.get('https://stacks-node-api.mainnet.stacks.co/extended/v1/block')

    const blocks = blocks_result.data.results

    console.log({blocks})
    return blocks
}

function output_blocks(blocks, db_file) {
    for (const block of blocks) {
        const block_string = JSON.stringify(block)
        console.log({block_string})


        fs.appendFileSync(db_file, block_string + '\n');
    }
}

function find_latest_block_id(db_file) {

    console.log({db_file})
    const contents = fs.readFileSync(db_file, 'utf8')
    // console.log({contents})
    const lines = contents.split('\n')

    for (const line of lines) {
        console.log({line})
    }
    const num = lines.length
    console.log({num})

    assert(lines.length > 1)  // note: if re-starting from scratch, this will fail
    assert(lines[lines.length - 1] == '')
    const last_line = lines[lines.length - 2]
    const last_block = JSON.parse(last_line)
    console.log({last_block})
    return last_block.height
}

async function run_internal(db_file) {

    const last_block_id = find_latest_block_id(db_file)
    console.log({last_block_id})

}



TX_JSON_FNAME = process.argv[2]
console.log({TX_JSON_FNAME})

run_internal(TX_JSON_FNAME)