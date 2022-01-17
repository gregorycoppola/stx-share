const {
    Pool,
    Client
} = require('pg')

async function main() {
    // clients will also use environment variables
    // for connection information
    const client = new Client()
    await client.connect()
    // const res = await client.query('SELECT NOW()')
    const res = await client.query('select block_hash, block_height, tx_id, status, microblock_hash, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length, length(raw_result) from txs order by block_height desc limit 5000')

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


    var limits = {
        execution_cost_read_count: 15000,
        execution_cost_read_length: 100000000,
        execution_cost_runtime: 5000000000,
        execution_cost_write_count: 15000,
        execution_cost_write_length: 100000000,
        length: 2 * 1024 * 1024,
    }

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
            total_txs: tx_list.length,
        }
        for (const index of indices) {
            fraction[index] = sum[index] * 1.0 // limits[index]
        }
        console.log(fraction)
    }
}

main()
