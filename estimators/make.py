import sys
import math
import matplotlib.pyplot as plt

median_file = sys.argv[1]
old_file = sys.argv[2]

def get_kv_list(file_name):
    lines = list(open(file_name, 'r'))
    kv_list = []
    last_block_height = None
    for line in lines:
        parts = line.strip().split(', ')
        kv = {}
        for part in parts[1:]:
            inner_parts = part.split(': ')
            kv[inner_parts[0]] = float(inner_parts[1])
        
        block_height = int(kv['block_height'])
        if block_height != last_block_height:
            kv_list.append(kv)
        last_block_height = block_height
    return kv_list

condition_to_kv = {
        'median': get_kv_list(median_file),
        'old': get_kv_list(old_file),
        }

def extract_list(condition, heading, use_log):
    kv_list = condition_to_kv[condition]
    r = []
    for kv in kv_list:
        base = kv[heading]
        # value = math.log(base) if use_log else base
        value = math.log(base)
        r.append(value)
    return r

median_high_log0 = extract_list('median', 'new_estimate_high', False)
median_middle_log0 = extract_list('median', 'new_estimate_middle', False)
median_low_log0 = extract_list('median', 'new_estimate_low', False)
old_high_log0 = extract_list('old', 'new_estimate_high', False)
old_middle_log0 = extract_list('old', 'new_estimate_middle', False)
old_low_log0 = extract_list('old', 'new_estimate_low', False)

median_high_log1 = extract_list('median', 'new_estimate_high', True)
median_middle_log1 = extract_list('median', 'new_estimate_middle', True)
median_low_log1 = extract_list('median', 'new_estimate_low', True)
old_high_log1 = extract_list('old', 'new_estimate_high', True)
old_middle_log1 = extract_list('old', 'new_estimate_middle', True)
old_low_log1 = extract_list('old', 'new_estimate_low', True)


plt.plot(median_middle_log0)
plt.plot(old_middle_log0)
plt.savefig('middle_log0.svg')

plt.plot(median_middle_log1)
plt.plot(old_middle_log1)
plt.savefig('special.svg')
