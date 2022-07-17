const process = require('process')
const fs = require('fs')

const input_raw_file = process.argv[2]


const contents = fs.readFileSync(input_raw_file, 'utf8')
const lines = contents.split('\n')
var output_objects = []
for (const line of lines) {
    if (line == '') {
        continue
    }
    // console.log({line})

    const date_part = line.split(' ')[0]
    // console.log({date_part})
    const point_date = new Date(date_part)
    // console.log({point_date})

    const size_part = line.split(' ')[3]
    // console.log({size_part})

    const size = parseInt(size_part)
    // console.log({size})


    if (!point_date || !size) {
        continue
    }
    const item = {
        timestamp: point_date,
        mempool_size: size,
    }
    
    console.log(JSON.stringify(item))


}


// console.log({output_objects})