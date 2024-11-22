import librosa
import numpy as np
import onnxruntime as ort
import os
import torchaudio
import onnx


file_path = 'music-dir/sample.mp3'
audio,rate = torchaudio.load(file_path)
transform = torchaudio.transforms.Resample(rate, 16000)
input_data = transform(audio).numpy()
print(input_data.shape)

model_path = 'model.onnx'

# Actual dimensions: (959252,)
# ONNX required input dimensions:: [1024, 128]

from transformers import AutoTokenizer
from onnxruntime import InferenceSession

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
session = InferenceSession(model_path)
# ONNX Runtime expects NumPy arrays as input
inputs = tokenizer("Using DistilBERT with ONNX Runtime!", return_tensors="np")
outputs = session.run(output_names=["last_hidden_state"], input_feed=dict(inputs))









# model = onnx.load(model_path)
# inputs = {}
# for inp in model.graph.input:
#     shape = str(inp.type.tensor_type.shape.dim)
#     inputs[inp.name] = [int(s) for s in shape.split() if s.isdigit()]

# print(inputs)


# session = ort.InferenceSession(model_path)
# input_data = np.expand_dims(input_data, axis=0)
# ort_inputs = {session.get_inputs()[0].name: input_data}
# result = session.run(None, ort_inputs)

# print(result)