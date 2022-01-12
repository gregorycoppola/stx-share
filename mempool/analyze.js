const axios = require('axios')

function add_to_map(count_map, key) {
    const count_or = count_map.get(key)
    const count = count_or ? count_or : 0
    count_map.set(key, count + 1)
}

async function main() {
    const mempool_result = await axios
        .post('https://stacks-node-api.mainnet.stacks.co/rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })

    const count_map = new Map()
    for (const tx of mempool_result.data.transaction_identifiers) {
        try {
            const tx_result = await axios
                .get('https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/' + tx.hash)
            let data = tx_result.data
            let tx_status = data.tx_status
            console.log(tx_status)
            add_to_map(count_map, tx_status)
            console.log({
                count_map
            })
        } catch (e) {
            console.log({
                e
            })
        }
    }
    console.log({
        count_map
    })
}

main()