import sys
import collections
import json
import numpy
import concurrent

import pessimistic_estimator
import average_estimator
import linear_estimator
import sgd_estimator
import error_functions
import matplotlib.pyplot as plt

data_fname = sys.argv[1]
model_name = sys.argv[2]

remove_trivial = True
remove_buggy = True

model_dict = {
        'pessimistic' : pessimistic_estimator.Model(),
        'average' : average_estimator.Model(),
        'linear' : linear_estimator.Model(),
        'sgd' : sgd_estimator.Model(),
}

model = model_dict[model_name]

with open(data_fname, 'r') as data_file:
    lines = data_file.readlines()

def key_is_trivial(key):
    return key == 'stx-transfer:runtime' or key == 'coinbase:runtime'

def key_is_buggy(key):
    return key == 'cc:boom-nfts.mint-series:runtime'

def collapse_arguments(arguments):
    total = 0
    for arg in arguments:
        total += int(arg['size'])
    return [{'type': 'any', 'size': total}]

unique_keys = set()
key_to_points = collections.defaultdict(list)
data_points = []
for idx, line in enumerate(lines):
    data_point = json.loads(line)
    if 'arguments' in data_point:
        data_point['arguments'] = collapse_arguments(data_point['arguments'])
    data_points.append(data_point)
    data_key = data_point['key']
    if remove_trivial and key_is_trivial(data_key):
        continue
    if remove_buggy and key_is_buggy(data_key):
        continue
    unique_keys.add(data_key)
    key_to_points[data_key].append(data_point)

def run_for_contract(focus_key):
    print(focus_key, file=sys.stderr)
    x_points = []
    gold_costs = []
    pred_costs = []
    for data_point in key_to_points[focus_key]:
        print(data_point)
        data_key = data_point['key']

        # Make the estimate first.
        offline_estimate = model.create_estimate(data_point)

        # Update the samples.
        model.update(data_point)
        
        # Store the estimate.
        gold_cost = data_point['actual']

        pred_costs.append(offline_estimate)
        gold_costs.append(float(gold_cost))

        x_points.append(data_point['arguments'][0]['size'])

    plt.scatter(x_points, gold_costs,  color='red')
    plt.plot(x_points, pred_costs, color='black')
    plt.savefig('plots/' + focus_key.replace(':', '_') + '.svg')

    for error_function in error_functions.all_functions:
        error = error_function(gold_costs, pred_costs)
        parts = [
            model_name,
            focus_key,
            error_function.__name__,
            str(error),
            ]
        print(','.join(parts))

executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)
executor.map(run_for_contract, unique_keys)

