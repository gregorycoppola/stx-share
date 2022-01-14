import collections
import os
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

rows = []
for txid, time in target_txs.iteritems():
	max_difference = 0
	max_key = 'none'
	key_time = None
	for filekey, tx_to_time in filename_to_tx_to_time.iteritems():
		if txid in tx_to_time:
			other_time = tx_to_time[txid]
			difference = time - other_time
			if difference > max_difference:
				max_difference = difference
				max_key = filekey
				key_time = other_time
	rows.append((txid, max_difference, max_key))


rows.sort(key=lambda tup : tup[1])

for row in rows:
	print (','.join([str(r) for r in row]))

