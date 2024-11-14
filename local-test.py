import modal
import onnxruntime as ort
import numpy as np
import librosa  # For audio processing
import os

model_path = './model_repository/simple-model/simple-model.onnx'

def run_onnx_model(input_data: str):
    # Load the ONNX model
    session = ort.InferenceSession(model_path)
    input_data = np.expand_dims(input_data, axis=0)
    ort_inputs = {session.get_inputs()[0].name: input_data}
    result = session.run(None, ort_inputs)
    return result

def process_audio_file(file_path):

    audio_data, sample_rate = librosa.load(file_path, sr=16000)  # Adjust sample rate as needed
    audio_data = audio_data.astype(np.float32)  # Ensure correct type

    input_size = 160000 #161977

    # Adjust audio_data length to match input_size
    if len(audio_data) < input_size:
        # Pad with zeros if audio is shorter than input_size
        padding = input_size - len(audio_data)
        audio_data = np.pad(audio_data, (0, padding), mode='constant')
    elif len(audio_data) > input_size:
        # Truncate if audio is longer than input_size
        audio_data = audio_data[:input_size]

    # Run the ONNX model with the processed audio data
    output = run_onnx_model(audio_data)
    return output

def main():

    file_name = os.path.join(os.getcwd(),'music-dir','raycharles-small.wav')
    print("Local: initiating upload of music file")
    
    # Process the audio file and get the output
    output = process_audio_file(file_name)
        
    print("Model output:", output)

if __name__ == "__main__":
    main()
