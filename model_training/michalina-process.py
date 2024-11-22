import librosa
import numpy as np
import onnxruntime as ort
import os


y, sr = librosa.load('music-dir/sample.mp3')
spect = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=2048, hop_length=1024)
input_data = librosa.power_to_db(spect, ref=np.max)[:,:640].T
model_path = 'rnn_onnx.onnx'

print(input_data.shape)

session = ort.InferenceSession(model_path)
input_data = np.expand_dims(input_data, axis=0)
ort_inputs = {session.get_inputs()[0].name: input_data}
result = session.run(None, ort_inputs)

print(result)