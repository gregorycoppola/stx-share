import sys
import math
import matplotlib.pyplot as plt

START_BLOCK_HEIGHT = 39000
COST_FACTOR = 317.0 / 1000000

median_file = sys.argv[1]
old_file = sys.argv[2]

def get_kv_list(file_name):
    lines = list(open(file_name, 'r'))
    kv_list = []
    idx_list = []
    last_block_height = None
    for line in lines:
        parts = line.strip().split(', ')
        kv = {}
        for part in parts[1:]:
            inner_parts = part.split(': ')
            kv[inner_parts[0]] = float(inner_parts[1])
        
        block_height = int(kv['block_height'])
        if block_height != last_block_height and block_height >= START_BLOCK_HEIGHT:
            kv_list.append(kv)
            idx_list.append(block_height)
        last_block_height = block_height
    return [kv_list, idx_list]

condition_to_kv = {
        'median': get_kv_list(median_file),
        'old': get_kv_list(old_file),
        }

def extract_list(condition, heading, display):
    [kv_list, idx_list] = condition_to_kv[condition]
    y = []
    x = []
    for kv, idx in zip(kv_list, idx_list):
        base = kv[heading] * COST_FACTOR
        if display == 'original' or display == 'cutoff':
            y.append(base)
            x.append(idx)
        if display == 'log':
            y.append(math.log(base, 10.0))
            x.append(idx)
    return [y, x]

levels = ['high', 'middle', 'low']
displays = ['original', 'log', 'cutoff']
for  level in levels:
    for display in displays:
        median = extract_list('median', 'new_estimate_' + level, display)
        old = extract_list('old', 'new_estimate_' + level, display)

        plt.figure(figsize=(20, 10))
        plt.clf()
        f, ax = plt.subplots(1, 1)
        plt.title('New vs. Old Fee Estimator')
        plt.xlabel('Block Height')
        plt.ylabel('Estimated fee for "stack-stx"')
        line1, = plt.plot(old[1], old[0])
        line1.set_label('old')
        line2, = plt.plot(median[1], median[0])
        line2.set_label('new')
        if display == 'cutoff':
            ax.set_ylim(0.0, 20.0)
        ax.legend()
        plt.savefig(level + '_' + str(display) + '.svg')
