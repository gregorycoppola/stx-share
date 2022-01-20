const {
    Pool,
    Client
} = require('pg')

const process = require('process')
const fs = require('fs')

async function main() {
    const input_config_fname = process.argv[2]
    const input_config_file = fs.readFileSync(input_config_fname)
    const input_config = JSON.parse(input_config_file)
    console.log({input_config})

    const block_height = '45000'

    // clients will also use environment variables
    // for connection information
    const input_client = new Client(input_config)
    await input_client.connect()
    const query = `select block_hash, burn_block_time, block_height, tx_id, status, microblock_hash, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length, length(raw_result) from txs where canonical = true and microblock_canonical = true and block_height >= ${block_height} order by block_height desc`
    const res = await input_client.query(query)

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
    await input_client.end()

    block_hash_set.delete('') // currently constructed block
    block_hash_set.delete(last_block_hash) // last block mentioned, might be incomplete

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

    var output_tuples = []
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

        const burn_block_time = new Date(parseInt(tx_list[0].burn_block_time, 10) * 1000).toLocaleString("en-US", {
            timeZone: "America/New_York"
        })
        var output_tuple = {
            block_hash,
            block_height: tx_list[0].block_height,
            burn_block_time,
            total_txs: tx_list.length,
        }

        var sum_fraction = 0.0
        var max_fraction = 0.0
        for (const index of indices) {
            const this_fraction = sum[index] * 1.0 / limits[index]
            if (this_fraction > max_fraction) {
                max_fraction = this_fraction;
            }
            sum_fraction += this_fraction
            output_tuple[index] = this_fraction;
        }
        output_tuple['execution_cost_max_dimension'] = max_fraction;
        output_tuple['execution_cost_sum'] = sum_fraction;

        output_tuples.push(output_tuple)
    }

    console.log(JSON.stringify(output_tuples))
}

main()
