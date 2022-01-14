DATA_DIR=$1
if [ -z ${DATA_DIR} ]; then
	echo "DATA_DIR is unset";
	exit 1;
else echo "DATA_DIR is set to '$DATA_DIR'"; fi

mkdir -p DATA_DIR

for i in `kubectl -n prod-stacks get po | grep follower | awk {'print $1'}`; do
	kubectl -n prod-stacks exec         \
		-it         $i         \
		-- sh -c 'echo "select txid, accept_time from mempool" | sqlite3 /root/stacks-node/data/mainnet/chainstate/mempool.sqlite'         \
		> ${DATA_DIR}/${i}.txt;
done
