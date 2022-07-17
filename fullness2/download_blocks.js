https://stacks-node-api.mainnet.stacks.co/extended/v1/block

// Step 1:
// curl curl https://stacks-node-api.mainnet.stacks.co/extended/v1/block > ${TX_JSON_FNAME}

const process = require('process')

TX_JSON_FNAME = process.argv[1]


console.log({TX_JSON_FNAME})