import json
import numpy as np
import os
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

METRICS = ["Accuracy", "Precision", "Recall", "F1-Score"]
LABELS = [0, 1, 2, 3, 4, 5, 7, 10]
EVAL_DIR = "../../model_evaluation"

def read_data():
    for root, dirs, _ in os.walk(root_dir):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            print(f"Directory: {dir_path}")


def calculate_metrics(y_true, y_pred):
    return [
        accuracy_score(y_true, y_pred),
        precision_score(y_true, y_pred, labels=LABELS, average='macro'),
        recall_score(y_true, y_pred, labels=LABELS, average='macro'),
        f1_score(y_true, y_pred, labels=LABELS, average='macro'),
    ]

def get_benchmarking_payload():
    # read the data for each model
    models = []
    data = []
    for dir_name in os.listdir(EVAL_DIR):
        file_name = os.path.join(EVAL_DIR, dir_name, "data.json")
        if os.path.isfile(file_name):
            with open(file_name) as file:
                file_data = json.load(file)
                models.append(file_data["name"])
                data.append(calculate_metrics(file_data["y_true"], file_data["y_pred"]))

    data = np.round(data, 3).tolist()

    # for each model, calculate the metrics (can just cache this if it takes a long time)
    return {
        "data": data,
        "models": models,
        "metrics": METRICS
    }

    # return {
    #     "data": [
    #         [.99, .89, .9], # the Accuracy, Precision, and AOC of CNN
    #         [.97, .79, .85], # the Accuracy, Precision, and AOC of CNN-2
    #         [.94, .3, .65],
    #         [.95, .92, .92],
    #         [.6, .3, .45],
    #     ],
    #     "models": ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"],
    #     "metrics": ["Accuracy", "Precision", "AOC"]
    # }
