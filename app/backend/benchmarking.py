
def read_data():
    pass

def calculate_metrics(y_true, y_pred):
    # sklearn.metrics.accuracy_score(y_true, y_pred, *, normalize=True, sample_weight=None, zero_division='warn')
    # sklearn.metrics.precision_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')[source]
    # sklearn.metrics.recall_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')[source]
    # sklearn.metrics.f1_score(y_true, y_pred, *, labels=None, pos_label=1, average='binary', sample_weight=None, zero_division='warn')
    # sklearn.metrics.roc_auc_score(y_true, y_score, *, average='macro', sample_weight=None, max_fpr=None, multi_class='raise', labels=None)

    # sklearn.metrics.auc(x, y)
    # sklearn.metrics.precision_recall_curve(y_true, y_score=None, *, pos_label=None, sample_weight=None, drop_intermediate=False, probas_pred='deprecated')[source]


    pass

def get_benchmarking_payload():
    # read the data for each model

    # for each model, calculate the metrics (can just cache this if it takes a long time)

    # TODO: Calculate metrics from predictions and test data stored on disk
    return {
        "data": [
            [.99, .89, .9], # the Accuracy, Precision, and AOC of CNN
            [.97, .79, .85], # the Accuracy, Precision, and AOC of CNN-2
            [.94, .3, .65],
            [.95, .92, .92],
            [.6, .3, .45],
        ],
        "models": ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"],
        "metrics": ["Accuracy", "Precision", "AOC"]
    }
