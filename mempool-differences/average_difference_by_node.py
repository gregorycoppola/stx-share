import collections
import os
import numpy as np
base_dir = os.getcwd() + '/mempool-data'

def make_dict():
	return collections.defaultdict(int)
filename_to_tx_to_time = collections.defaultdict(make_dict)

for filename in os.listdir(base_dir):
	# print(filename)
	file = open(os.path.join(base_dir, filename), 'r')
	lines = file.readlines()
	# print (filename, len(lines))

	file_key = filename.split('.txt')[0]

	for line in lines:
		parts = line.split('|')
		filename_to_tx_to_time[file_key][parts[0]] = int(parts[1])

target_txs = filename_to_tx_to_time['stacks-node-follower-events-blue-0']

key_to_times = collections.defaultdict(list)
for txid, time in target_txs.iteritems():
	for filekey, tx_to_time in filename_to_tx_to_time.iteritems():
		if txid in tx_to_time:
			other_time = tx_to_time[txid]
			difference = time - other_time
			key_to_times[filekey].append(difference)


for key, time_list in key_to_times.iteritems():
	avg = np.mean(time_list)
	std = np.std(time_list)
	print(','.join([key, str(avg), str(std)]))
