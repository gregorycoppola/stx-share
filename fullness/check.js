const {
    Pool,
    Client
} = require('pg')

async function process_tx_table(client) {
    const res = await client.query('select block_hash, burn_block_time, block_height, tx_id, status, microblock_hash, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length, length(raw_result) from txs where canonical = true and microblock_canonical = true order by block_height desc limit 1000')

    const block_hash_set = new Set()
    const block_txs_map = new Map()
    var last_block_hash = undefined // delete the last used block because it's not necessarily complete
    for (const row of res.rows) {
        const block_hash = row.block_hash.toString('hex')
        const txs_or = block_txs_map.get(block_hash)
        const txs = txs_or ? txs_or : []
        txs.push(row)
        block_hash_set.add(block_hash)
        last_block_hash = block_hash
        block_txs_map.set(block_hash, txs)
    }
    await client.end()

    block_hash_set.delete('')  // currently constructed block
    block_hash_set.delete(last_block_hash)  // last block mentioned, might be incomplete

    const indices = [
        'execution_cost_read_count',
        'execution_cost_read_length',
        'execution_cost_runtime',
        'execution_cost_write_count',
        'execution_cost_write_length',
        'length',
    ]

    var result = []
    for (const block_hash of block_hash_set) {
        const tx_list = block_txs_map.get(block_hash)
            var sum = {
                execution_cost_read_count: 0,
                execution_cost_read_length: 0,
                execution_cost_runtime: 0,
                execution_cost_write_count: 0,
                execution_cost_write_length: 0,
                length: 0,
            }
        for (const tx of tx_list) {
            for (const index of indices) {
                sum[index] += parseInt(tx[index], 10)
            }
        }
        var fraction = {
            block_hash,
            block_height: tx_list[0].block_height,
            burn_block_time: new Date(parseInt(tx_list[0].burn_block_time, 10) * 1000),
            total_txs: tx_list.length,
        }
        for (const index of indices) {
            fraction[index] = sum[index] * 1.0
        }
        result.push(fraction)
    }
    return result
}

async function process_blocks_table(client) {
    const res = await client.query('select block_hash, burn_block_time, block_height, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length from blocks order by block_height desc limit 10')

    const indices = [
        'execution_cost_read_count',
        'execution_cost_read_length',
        'execution_cost_runtime',
        'execution_cost_write_count',
        'execution_cost_write_length',
        'length',
    ]

    var result = new Map()
    for (const row of res.rows) {
        const block_hash = row.block_hash.toString('hex')
        var fraction = {
            block_hash,
            block_height: row.block_height,
            burn_block_time: new Date(parseInt(row.burn_block_time, 10) * 1000),
        }
        for (const index of indices) {
            fraction[index] = row[index] * 1.0
        }
        result.set(block_hash, fraction)
    }
    return result
}

function find_row(blocks_result, block_hash) {
    for (const block of blocks_result) {
        if (block.block_hash == block_hash) {
            return block
        }
    }
    return undefined
}

async function main() {
    // clients will also use environment variables
    // for connection information
    const client1 = new Client()
    await client1.connect()
    const tx_table = await process_tx_table(client1)
    const client2 = new Client()
    await client2.connect()
    const blocks_map = await process_blocks_table(client2)

    for (const tx of tx_table) {
        const other_row = blocks_map.get(tx.block_hash)
        console.log({tx})
        console.log({other_row})
    }
}

main()
