import sys

median_file = sys.argv[1]
old_file = sys.argv[1]

def get_kv_list(file_name):
    lines = list(open(file_name, 'r'))
    kv_list = []
    for line in lines[:100]:
        parts = line.strip().split(', ')
        kv = {}
        for part in parts[1:]:
            inner_parts = part.split(': ')
            kv[inner_parts[0]] = float(inner_parts[1])
        kv_list.append(kv)
    return kv_list

condition_to_kv = {
        'median': get_kv_list(median_file),
        'old': get_kv_list(old_file),
        }

def extract_list(condition, heading):
    kv_list = condition_to_kv[condition]
    r = []
    for kv in kv_list:
        r.append(kv[heading])
    return r

median_high = extract_list('median', 'new_estimate_high')
median_middle = extract_list('median', 'new_estimate_middle')
median_low = extract_list('median', 'new_estimate_low')
old_high = extract_list('old', 'new_estimate_high')
old_middle = extract_list('old', 'new_estimate_middle')
old_low = extract_list('old', 'new_estimate_low')



