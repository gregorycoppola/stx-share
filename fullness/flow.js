const { Pool, Client } = require('pg')

async function main() {
    // clients will also use environment variables
    // for connection information
    const client = new Client()
    await client.connect()
    // const res = await client.query('SELECT NOW()')
    const res = await client.query('select block_hash, block_height, tx_id, status, microblock_hash, execution_cost_read_count, execution_cost_read_length, execution_cost_runtime, execution_cost_write_count, execution_cost_write_length, length(raw_result) from txs where status = 1 order by block_height desc limit 5000')
    console.log({res})
    await client.end()
}

main()
