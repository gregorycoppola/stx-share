const axios = require('axios')

function add_to_map(count_map, key) {
    const count_or = count_map.get(key)
    const count = count_or ? count_or : 0
    count_map.set(key, count + 1)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    while (true) {
        try {
            const mempool_result = await axios
                .post('https://stacks-node-api.mainnet.stacks.co/rosetta/v1/mempool', {
                    network_identifier: {
                        blockchain: "stacks",
                        network: "mainnet"
                    }
                })
            const date = new Date()
            const ids = mempool_result.data.transaction_identifiers
            console.log(date, {id_size : ids.length})
        } catch (error) {
            console.log({error})
        }

        await sleep(30 * 1000)
    }
}

main()
