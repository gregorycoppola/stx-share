"""
usage:
    python3 analyze1.py [file_name]
"""

import sys
from collections import defaultdict

# Get filename from argv
file_name = sys.argv[1]

# Necessary constants
METRICS_START = 5
METRICS_COUNT = 6
METRICS_END = METRICS_START + METRICS_COUNT
MICROBLOCK_HASH_COL = 4

content = open(file_name, 'r')
lines = content.readlines()

# Create a map from 1) block_hash to 2) rows for that block_hash
key_to_rows = defaultdict(list)
for line in lines:
    parts = line.split('\t')
    parts = [p for p in parts if p]
    assert len(parts) == METRICS_END, len(parts)
    try:
        for i in range(METRICS_START, METRICS_END):
            parts[i] = int(parts[i])
        key_to_rows[parts[0]].append(parts)
    except Exception as e:
        # If we have a problem, crash.
        print('problem', e, line)
        sys.exit(1)

# Define the limits based on the Rust code definitions
"""
pub const BLOCK_LIMIT_MAINNET_205: ExecutionCost = ExecutionCost {
    read_count: 15_000,
    read_length: 100_000_000,
    runtime: 5_000_000_000,
    write_count: 15_000,
    write_length: 15_000_000,
};
"""
limits = [15000, 100000000, 5000000000, 15000, 15000000, 2 * 1024 * 1024]

# For each pair of (block_hash, rows), summarize the row, and output a csv.
for idx, rows in key_to_rows.items():
    metrics = [0, 0, 0, 0, 0, 0]
    num_microblock_txs = 0
    for row in rows:
        microblock_hash = row[MICROBLOCK_HASH_COL]
        if microblock_hash == '\\\\x':
            num_microblock_txs += 1
        for i in range(0, METRICS_COUNT):
            j = METRICS_START + i
            metrics[i] += row[j]

    fraction_metrics = []
    for i in range(0,6):
        fraction_metrics.append(1.0 * metrics[i] / limits[i])

    block_height = rows[0][1]
    row = [idx, block_height] + fraction_metrics + [len(rows), num_microblock_txs]
    row = [str(v) for v in row]
    print (','.join(row))
