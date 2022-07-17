const axios = require('axios')

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
    for (const tx of mempool_result.data.transaction_identifiers) {
        try {
            const tx_result = await axios
                .get(base_url + 'extended/v1/tx/' + tx.hash)
            let data = tx_result.data
            let tx_status = data.tx_status
            console.log({
		    tx_id: tx_result.data.tx_id,
		    tx_status
	    })
                console.log({data})
        } catch (e) {
            console.log({
                e
            })
        }
        break;
    }
    console.log({
        count_map
    })
}

main()
