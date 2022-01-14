import sys
import collections
import json
import numpy

data_fname = sys.argv[1]

remove_trivial = True

with open(data_fname, 'r') as data_file:
    lines = data_file.readlines()

def key_is_trivial(key):
    return key == 'stx-transfer:runtime' or key == 'coinbase:runtime'

name_to_argsize = {}
offenders = set()
for idx, line in enumerate(lines):
    data_point = json.loads(line)
    data_key = data_point['key']

    if remove_trivial and key_is_trivial(data_key):
        continue

    if 'arguments' in data_point:
        arguments = data_point['arguments']
    else:
        arguments = []


    if data_key not in name_to_argsize:
        name_to_argsize[data_key] = len(arguments)
    else:
        last_size = name_to_argsize[data_key]
        if last_size != len(arguments):
            offenders.add(data_key)

    if False:
        arg_string = ''
        for arg in arguments:
            arg_string += arg['type'] + '\t'
        print(data_point['block_height'], data_key, len(arguments), arg_string)

print(offenders)
    
