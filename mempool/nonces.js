const axios = require('axios')

function add_to_map(count_map, key) {
    const count_or = count_map.get(key)
    const count = count_or ? count_or : 0
    count_map.set(key, count + 1)
    console.log({
        count_map,
    })
}

async function main() {
    const mempool_result = await axios
        .post('http://127.0.0.1:3999/rosetta/v1/mempool', {
            network_identifier: {
                blockchain: "stacks",
                network: "mainnet"
            }
        })
    console.log({
        mempool_result
    })

    const count_map = new Map()
	var i = 0
    for (const tx of mempool_result.data.transaction_identifiers) {
	    i += 1
        try {
            const tx_result = await axios
                .get('http://127.0.0.1:3999/extended/v1/tx/' + tx.hash)
            let data = tx_result.data
            let tx_status = data.tx_status
            console.log({
                tx_status
            })
            if (tx_status != 'pending') {
		    add_to_map(count_map, tx_status)
                continue
            }

            let sender_address = data.sender_address

            let nonce_url = 'http://127.0.0.1:3999/extended/v1/address/' + sender_address + '/nonces'
            const nonce_result = await axios.get(nonce_url)
            console.log(nonce_result.data)

            let mempool_nonce = tx_result.data.nonce
            let needed_nonce = nonce_result.data.last_executed_tx_nonce + 1
            console.log({
                mempool_nonce,
                needed_nonce
            })

		let print_status = tx_status + '--'
            if (mempool_nonce < needed_nonce) {
                add_to_map(count_map, print_status + 'nonce-too-low')
            }
            if (mempool_nonce == needed_nonce) {
                add_to_map(count_map, print_status + 'nonce-correct')
            }
            if (mempool_nonce > needed_nonce) {
                add_to_map(count_map, print_status + 'nonce-too-high')
            }

        } catch (e) {
            console.log({
                e
            })
        }
    }
    console.log({
	    total_examples: i,
        count_map,
    })
}

main()
