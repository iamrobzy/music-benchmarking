
def getData():
    # get data from cache if available
    # otherwise calculate metrics
    pass

def calculate_metrics():
    pass

def get_benchmarking_payload():
    # TODO: Calculate metrics from test data
    return {
        "data": [
            [.99, .89, .9],
            [.97, .79, .85],
            [.94, .3, .65],
            [.95, .92, .92],
            [.6, .3, .45],
        ],
        "models": ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"],
        "metrics": ["Accuracy", "Precision", "AOC"]
    }
