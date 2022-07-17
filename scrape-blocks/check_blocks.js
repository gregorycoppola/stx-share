const fs = require('fs')

const db_file = process.argv[2]
const contents = fs.readFileSync(db_file, 'utf8')
const lines = contents.split('\n')

var blocks = []
for (const line of lines) {
    if (line == '') {
        continue
    }
    const block = JSON.parse(line)
    console.log({block})
    blocks.push(block)
}

console.log({length : blocks.length})



for (var i = 1; i < blocks.length; i +=1 ) {
    const this_height = blocks[i].height 
    const last_height = blocks[i-1].height


    if (this_height - last_height != -1) {
        console.log({this_height, last_height})

    }
}