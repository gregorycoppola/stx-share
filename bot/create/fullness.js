const {
    Pool,
    Client
} = require('pg')

const process = require('process')
const fs = require('fs')

function read_config(fname, description) {
    if (!fname) {
        throw new Error("filename doesn't exist for " + description)
    }
    const config_file = fs.readFileSync(fname)
    return JSON.parse(config_file)
}

async function main() {
    const output_config = read_config(process.argv[2], 'output_config')
    console.log({output_config})

    const output_client = new Client(output_config)
    await output_client.connect()

    {
        const query = 'drop table block_fullness'
        const res = await output_client.query(query)
        console.log(res)
    }
    {
        const query = `
            create table block_fullness(
                block_hash varchar,
                burn_block_time varchar,
                block_height int,
                total_txs int,
                total_microblock_txs int,
                  execution_cost_read_count float8,
      execution_cost_read_length float8,
      execution_cost_runtime float8,
      execution_cost_write_count float8,
      execution_cost_write_length float8,
      length float8,
      execution_cost_max_dimension float8,
      execution_cost_sum float8)
        `
        const res = await output_client.query(query)
        console.log(res)
    }

    process.exit(0)
}

main()
