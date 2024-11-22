import modal
import onnxruntime as ort
import numpy as np
import librosa  # For audio processing
import os
import sys
import requests
import logging
from fastapi import FastAPI, File, UploadFile, Body
import aiofiles
import io
from pydantic import BaseModel
import jsonify

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define a Modal app
image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install_from_requirements(requirements_txt='api-requirements.txt')
    .run_commands("mkdir -p /tmp/music-dir ~/model-dir")
)

app = modal.App(name='inference-api', image=image)
model_vol, model_store = modal.Volume.from_name("model-store"), "/vol/models"
music_vol, music_dir = modal.Volume.from_name("music-dir"),  "/vol/music-dir"


@app.function(volumes={model_store: model_vol}, gpu="any")
def run_onnx_model(input_data: str, model_path: str = 'simple-model.onnx'):

    logging.info(f"Running ONNX model: {model_path}")
    session = ort.InferenceSession(os.path.join(model_store, model_path))
    input_data = np.expand_dims(input_data, axis=0)
    ort_inputs = {session.get_inputs()[0].name: input_data}
    result = session.run(None, ort_inputs)
    logging.info(f"Model run completed with result: {result}")
    return result


# @app.function(mounts=[modal.Mount.from_local_dir("./music-dir", condition=lambda pth: '.mp3' or '.wav' in pth, remote_path='/tmp/music-dir')])
@app.function(volumes={music_dir: music_vol})
def process_audio_file(file_path):

    music_vol.reload()

    logging.info(f"Processing audio file: {file_path}")

    audio_data, sample_rate = librosa.load(file_path, sr=16000)  # Adjust sample rate as needed
    audio_data = audio_data.astype(np.float32)  # Ensure correct type

    input_size = 160000  # assuming file has 10 seconds of audio at 16 kHz

    if len(audio_data) < input_size:
        padding = input_size - len(audio_data)
        audio_data = np.pad(audio_data, (0, padding), mode='constant')
    elif len(audio_data) > input_size:
        audio_data = audio_data[:input_size]

    logging.info(f"Audio processing completed for file: {file_path}")
    return audio_data


@app.function(volumes={model_store: model_vol})
async def upload_model(file: UploadFile):

    file_path = os.path.join(model_store, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    logging.info(f"Model {file.filename} uploaded successfully")
    return {"message": f"Model {file.filename} uploaded successfully"}


@app.function(volumes={music_dir: music_vol})
async def upload_audio(file: bytes = Body(...), filename: str = 'audio'):

    file_path = os.path.join(music_dir, filename)
    with open(file_path, "wb") as f:
        f.write(file)
    music_vol.commit()
    
    logging.info(f"Audio file {filename} uploaded successfully")
    return {"message": f"Audio file {filename} uploaded successfully"}


class AudioFile(BaseModel):
    audio_bytes: bytes
    filename: str = 'test.mp3'

@app.function(volumes={model_store: model_vol, music_dir: music_vol})
@modal.web_endpoint(method="POST")
async def infer_all_models(audio_path : str = f'{music_dir}/audiofile'):


    logging.info('Initiating audio processing')

    audio_data = process_audio_file.remote(audio_path)

    # Run the model
    logging.info('Initiating model run')
    try:
        output = run_onnx_model.remote(audio_data)
        logging.info(f"Inference completed with output: {output}")
        print(type(output[0]))
        return {'message': output[0].tolist()}
    except Exception as e:
        logging.error(f"Model run error: {str(e)}")
        return {"error": str(e)}



@app.function(volumes={model_store: model_vol})
async def process_audio_with_model(file: UploadFile, model_name: str):

    logging.info(f"Processing audio file {file.filename} with model {model_name}")
    file_path = os.path.join('/tmp/music-dir', file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    output = process_audio_file.remote(file.filename, model_name)
    logging.info(f"Audio processed successfully with model {model_name}")
    return {"message": "Audio processed successfully", "output": output}

@app.local_entrypoint()
async def main():
    # if len(sys.argv) < 2:
    #     logging.error("Please provide the model name as an argument.")
    #     sys.exit(1)

    # model_name = sys.argv[1]
    # logging.info(f"Using model: {model_name}")

    file_name = 'raycharles-small.wav'
    logging.info("Local: initiating upload of music file")

    file_path = './audio_uploads/raycharles-new-name.wav'
    file = {'file': open(file_path, 'rb')}

    # contents = await infer_all_models.local(file)

    resp = requests.post(url='https://iamrobzy-inference--inference-api-infer-all-models.modal.run', files=file)