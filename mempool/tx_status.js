const axios = require('axios')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const base_url = 'https://stacks-node-api.mainnet.stacks.co/'
async function main() {
    const mempool_result = await axios
        .post(base_url + 'rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })

    const count_map = new Map()
    var query_order = 0
    for (const tx of mempool_result.data.transaction_identifiers) {
        for (var i = 0; i < 5; i += 1) {
            try {
                const tx_result = await axios
                    .get(base_url + 'extended/v1/tx/' + tx.hash)
                let data = tx_result.data
                let tx_status = data.tx_status
                console.log({
                    tx_id: tx_result.data.tx_id,
                    tx_status,
                    try_id: i,
                    query_order,
                })
            query_order += 1
                break
            } catch (e) {
                console.log({
                    e
                })
                sleep(20000)
            }

            query_order += 1

        }
    }
    console.log({
        count_map
    })
}

main()
