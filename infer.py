import modal
import onnxruntime as ort
import numpy as np
import librosa  # For audio processing
import os
import sys
import requests
from fastapi import FastAPI, File, UploadFile

# Define a Modal app
image = (
        modal.Image.debian_slim(python_version="3.10")
        .pip_install_from_requirements(requirements_txt = 'api-requirements.txt')
        .run_commands("mkdir -p /tmp/music-dir ~/model-dir")
)

app = modal.App(name='inference-api',image=image)
vol = modal.Volume.from_name("model-store")
model_store_path = "/vol/models"

@app.function(volumes={model_store_path: vol}, gpu="any")  
def run_onnx_model(input_data: str, model_path: str = 'simple-model.onnx'):
    # Load the ONNX model
    session = ort.InferenceSession(os.path.join(model_store_path, model_path))
    input_data = np.expand_dims(input_data, axis=0)
    ort_inputs = {session.get_inputs()[0].name: input_data}
    result = session.run(None, ort_inputs)
    return result

@app.function(mounts=[modal.Mount.from_local_dir("./music-dir", condition=lambda pth: '.wav' in pth, remote_path='/tmp/music-dir')])
def process_audio_file(file_path):
    # Load and preprocess the audio filei
    file_path = os.path.join('/tmp/music-dir',file_path)
    if os.path.exists(file_path):
        print(f"music file exists - {file_path}")
    else:
        print("music file not found...")

    audio_data, sample_rate = librosa.load(file_path, sr=16000)  # Adjust sample rate as needed
    audio_data = audio_data.astype(np.float32)  # Ensure correct type

    input_size = 160000 # assuming file has 10 seconds of audio at 16 kHz

    # Adjust audio_data length to match input_size
    if len(audio_data) < input_size:
        # Pad with zeros if audio is shorter than input_size
        padding = input_size - len(audio_data)
        audio_data = np.pad(audio_data, (0, padding), mode='constant')
    elif len(audio_data) > input_size:
        # Truncate if audio is longer than input_size
        audio_data = audio_data[:input_size]

    # Run the ONNX model with the processed audio data
    try:
        output = run_onnx_model.remote(audio_data)
    except:
        print('model run error')

    print(f"SUCCESS!")
    
    return output

                                                                                                                                                               
# @app.function(volumes={model_store_path: vol})
# async def upload_model(file: UploadFile):
#     file_path = os.path.join(model_store_path, file.filename)
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
#     return {"message": f"Model {file.filename} uploaded successfully"}


# from fastapi import File, UploadFile, HTTPException
        
# @app.post("/upload")
# @modal.web_endpoint(method="POST")
# def upload(file: UploadFile = File(...)):
#     try:
#         with open(file.filename, 'wb') as f:
#             while contents := file.file.read(1024 * 1024):
#                 f.write(contents)
#     except Exception:
#         raise HTTPException(status_code=500, detail='Something went wrong')
#     finally:
#         file.file.close()

#     return {"message": f"Successfully uploaded {file.filename}"}


# @app.post("/upload_audio/")
# async def upload_audio(file: UploadFile = File(...)):
#     file_path = os.path.join('/tmp/music-dir', file.filename)
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
#     return {"message": f"Audio file {file.filename} uploaded successfully"}


@app.function(volumes={model_store_path: vol})
async def process_audio_with_model(file: UploadFile, model_name: str):
    # Save the uploaded audio file to the temporary directory
    file_path = os.path.join('/tmp/music-dir', file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Process the audio file with the specified model
    output = process_audio_file.remote(file.filename, model_name)
    
    return {"message": "Audio processed successfully", "output": output}
                                                                                                                                                                                                             

@app.local_entrypoint()
def main():

    if len(sys.argv) < 2:
        print("Please provide the model name as an argument.")
        sys.exit(1)

    model_name = sys.argv[1]
    print(f"Using model: {model_name}")

    file_name = 'raycharles-small.wav'
    print("Local: initiating upload of music file")
    
    # Process the audio file and get the output
    output = process_audio_file.remote(file_name)
        
    print("Model output:", output)
