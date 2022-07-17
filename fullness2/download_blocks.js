// Step 1:
// curl https://stacks-node-api.mainnet.stacks.co/extended/v1/block > ${FILE_NAME}

// Step 2:
// node download_blocks.js ${FILE_NAME}

const process = require('process')

TX_JSON_FNAME = process.argv[1]
console.log({TX_JSON_FNAME})