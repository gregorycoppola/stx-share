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
    const res = await client.query('select block_hash, burn_block_time, block_height, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length from blocks order by block_height desc limit 1000')

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

    for (const row of res.rows) {
        var fraction = {
            block_hash: row.block_hash,
            block_height: row.block_height,
            burn_block_time: new Date(parseInt(row.burn_block_time, 10) * 1000),
        }
        for (const index of indices) {
            fraction[index] = row[index] * 1.0 / limits[index]
        }
        console.log(fraction)
    }
}

main()
