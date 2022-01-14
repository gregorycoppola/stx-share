import sys
import collections
import json
import numpy

import pessimistic_estimator
import average_estimator
import linear_estimator
import sgd_estimator
import error_functions

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

print('update', file=sys.stderr)
for idx, line in enumerate(lines):
    data_point = json.loads(line)
    data_key = data_point['key']

    if remove_trivial and key_is_trivial(data_key):
        continue

    if remove_buggy and key_is_buggy(data_key):
        continue

    # Update the samples.
    model.update(data_point)
    
print('train', file=sys.stderr)
model.train()

print('predict', file=sys.stderr)
gold_costs = []
pred_costs = []
for idx, line in enumerate(lines):
    data_point = json.loads(line)
    data_key = data_point['key']

    if remove_trivial and key_is_trivial(data_key):
        continue

    if remove_buggy and key_is_buggy(data_key):
        continue

    # Make the estimate first.
    offline_estimate = model.create_estimate(data_point)

    # Store the estimate.
    rust_estimate = data_point['estimate']
    gold_cost = data_point['actual']

    pred_costs.append(offline_estimate)
    gold_costs.append(float(gold_cost))

for error_function in error_functions.all_functions:
    error = error_function(gold_costs, pred_costs)
    parts = [
        model_name,
        error_function.__name__,
        str(error),
        ]
    print(','.join(parts))
