const axios = require('axios')

function add_to_map(base_dict, key) {
    if key in base_dict {
        base_dict[key] += 1 
    }
}

async function main() {
    const mempool_result = await axios
        .post('https://stacks-node-api.mainnet.stacks.co/rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })

    let data = mempool_result.data
    for (const tx of mempool_result.data.transaction_identifiers) {
        try {
            const tx_result = await axios
                .get('https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/' + tx.hash)
            let data = tx_result.data
            let tx_status = data.tx_status
            console.log({
                tx_status
            })
        } catch (e) {
            console.log({
                e
            })
        }
    }
}

main()
