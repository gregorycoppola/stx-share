import sys
import collections
import json

output_fname = sys.argv[1]

"""
Converts a Rust-style structured output line to a python-style dict.

Input format is like:
    INFO [1631296771.981741] [src/cost_estimates/pessimistic.rs:213] [chains-coordinator] PessimisticEstimator received event, key: coinbase:runtime, estimate: 0, actual: 1, estimate_err: -1, estimate_err_pct: -1

Output is a dict mapping strings to strings.
"""
def rust_to_map(line):
    parts = line.rstrip().split(', ')
    result = {}
    for part in parts[1:]:
        inner_parts = part.split(': ', 2)
        result [inner_parts[0]] = inner_parts[1]
    return result

"""
There is a bug in the rust output that writes 'type' instead of 'type:'.
"""
def fix_type_bug(original_line):
    return original_line.replace('type ', 'type: ', 1)

"""
Hacky function, that takes a key like `version`, and picks out the atomic value
associated with that.

Takes a line like:
WARN [1631725964.876143] [src/chainstate/coordinator/mod.rs:681] [chains-coordinator] data:header_info StacksHeaderInfo { anchored_header: StacksBlockHeader { version: 0, total_work: StacksWorkScore { burn: 3788391672, work: 2186 } } }
"""
def extract_structured_field_into(line, key, kv):
    outer_split = key + ': '
    outer_parts = line.split(outer_split)
    assert(len(outer_parts) > 1)
    inner_split = outer_parts[1].split(',')
    value = inner_split[0]
    kv[key] = value

header_kv = []
kv = []
kv_list = []


for line in sys.stdin:
    if "data:header_info" in line:
        # print ('kv', kv)
        header_kv = collections.defaultdict(list)
        extract_structured_field_into(line, 'block_height', header_kv)
        extract_structured_field_into(line, 'consensus_hash', header_kv)
                # print(header_kv['block_height'], header_kv['consensus_hash'], len(kv_list))

    if "PessimisticEstimator received event" in line:
        # print(line)
        kv_list.append(kv)
        kv = collections.defaultdict(list)
        kv.update(header_kv)
        additions = rust_to_map(line)
        kv.update(additions)

    if "New data event received" in line:
        # print(line)
        kv['elements'].append(rust_to_map(line))

    if 'contract argument,' in line:
        # There is a bug in the output script that forgets the colon.
        fixed_line = fix_type_bug(line)
        kv['arguments'].append(rust_to_map(fixed_line))


outfile = open(output_fname, 'w')
for kv in kv_list:
    kv_line = json.dumps(kv)
    outfile.write(kv_line + '\n')

