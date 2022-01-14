for i in `kubectl -n prod-stacks get po | grep follower | awk {'print $1'}`; do 
	ip=$(kubectl -n prod-stacks describe po $i | grep "^IP:" | cut -c 15-)
	echo $i [$ip]

	url="http://${ip}:20443/v2/neighbors"
	echo $url
	command="curl -sL \"${url}\""
	echo $command
	eval $command
done
