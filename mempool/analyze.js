const axios = require('axios')

async function main() {
    const result = await axios
        .post('https://stacks-node-api.mainnet.stacks.co/rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })
    let data = result.data

    for (const tx of result.data.transaction_identifiers) {
        let hash = tx.hash
        console.log({hash})
    }
}

main()
