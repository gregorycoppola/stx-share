import sys
import collections
import json
import numpy

import sklearn.linear_model as linear_model

BLOCK_LIMIT_MAINNET = [
    5000000000, # runtime: 
    15000000, # write_length: 
    7750, # write_count: 
    100000000, # read_length: 
    7750, # read_count: 
    ]

def create_point_estimate(estimate_components):
    sigma = 0.0
    for idx, number in enumerate(estimate_components):
        part = number * 1.0 / BLOCK_LIMIT_MAINNET[idx] * 1000
        sigma += part
    return sigma


"""
Parses out the sizes of the argument sizes for a function. The 'arguments' element looks like the following,
and the sizes are just returned in order.
"arguments": [{"type": "UIntType", "size": "16"}, {"\"version\"": "(buff 1),})", "type": "TupleType(TupleTypeSignature { \"hashbytes\"", "size": "79"}]
"""
def get_argument_sizes(data_point):
    if 'arguments' not in data_point:
        return [1.0]
    result = []
    for t in data_point['arguments']:
        result.append(int(t['size']))
    return result

def fresh_model():
    return linear_model.Ridge(alpha=.2)

"""
Python implementation of an "average" modeler.
"""
class Model(object):
    def __init__(self):
        self._runtime_key_to_X = collections.defaultdict(list)
        self._element_key_to_Y = collections.defaultdict(list)
        self._element_key_to_model = collections.defaultdict(fresh_model)

    def update(self, data_point):
        runtime_key = data_point['key']
        argument_sizes = get_argument_sizes(data_point)
        data_array = numpy.array(argument_sizes).reshape(1, -1)
        # print('training', runtime_key, data_array)

        # Update the X's.
        self._runtime_key_to_X[runtime_key].append(argument_sizes)

        # Update the Y's.
        for element in data_point['elements']:
            element_key = element['key']
            value = int(element['value'])
            self._element_key_to_Y[element_key].append([value])

            ridge = fresh_model()
            X = self._runtime_key_to_X[runtime_key]
            Y = self._element_key_to_Y[element_key]
            # print('X', X)
            # print('Y', Y)
            ridge.fit(X, Y)
            self._element_key_to_model[element_key] = ridge
        

    def create_estimate(self, data_point):
        runtime_key = data_point['key']
        event_base = runtime_key.split(':runtime')[0]
        component_name = [':runtime', ':write-length', ':write-count', ':read-length', ':read-count']
        argument_sizes = get_argument_sizes(data_point)
        estimate_components = []
        for component_name in component_name:
            element_key = event_base + component_name
            if element_key in self._element_key_to_model:
                ridge = self._element_key_to_model[element_key]
                data_array = numpy.array(argument_sizes).reshape(1, -1)
                # print('prediction', runtime_key, data_array)
                prediction = ridge.predict(data_array)
                estimate_components.append(prediction)
                if False:
                    try:
                        prediction = ridge.predict(data_array)
                        estimate_components.append(prediction)
                    except ValueError:
                        print('ValueError')
                        estimate_components.append(0.0)
            else:
                estimate_components.append(0.0)
        estimate = create_point_estimate(estimate_components)
        return estimate
