const axios = require('axios')

function add_to_map(count_map, key) {
    const count_or = count_map.get(key)
    const count = count_or ? count_or : 0
    count_map.set(key, count + 1)
}

async function main() {
	console.log('hello')

    const mempool_result = await axios
        .post('http://127.0.0.1:3999/rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })
	console.log({mempool_result})

    const count_map = new Map()
    for (const tx of mempool_result.data.transaction_identifiers) {
        try {
            const tx_result = await axios
                .get('http://127.0.0.1:3999/extended/v1/tx/' + tx.hash)
            let data = tx_result.data
            let tx_status = data.tx_status
            console.log(data)
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
