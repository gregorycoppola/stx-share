import json
import sys

file_name = sys.argv[1]
data = []
with open(file_name, 'r') as f:
    for line in f:
        print(line)
        point = json.loads(line)
        print(point)
