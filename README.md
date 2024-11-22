<!-- PROJECT LOGO -->
<a id="readme-top"></a>
<br />
  <h3 align="center">Music-Tagging and Genre-Classification Platform</h3>
  <p align="center">
    A platform for evaluating genre-classification models
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## Project Details

This platform addresses the lack of standardized comparison tools music genre-classification models. It allows users to visualize evaluation metrics as well as compare classification outputs amongst models. 

Key features:
- Visualise evaluation metrics, i.e. accuracy, precision, recall, F1-score.
- Upload and compare genre classification outputs from uploaded models.

<!-- FOLDER STRUCTURE -->
## Folder Structure

- `./app` - UI folder including frontend and backend
- `./model_evaluation` - prediction-labels outputs of model evaluation
- `./model_repository` - folders containing ONNX models
- `./model_training` - training notebooks for models
- `./music_dir` - buffer folder for music uploads

# Models

The models trained / fine-tuned in this project are:
- Audio Spectrogram Transformers (AST)
- Wav2Vec2.0
- Sequential CNN-LSTM
- Parallel CNN-GRU


## Datasets

- [Free Music Archive (FMA)](https://github.com/mdeff/fma?tab=readme-ov-file)
- [MTG-Jamendo Dataset](https://github.com/MTG/mtg-jamendo-dataset)

<!-- GETTING STARTED -->
## Getting Started

To set up this project locally, follow these steps:

1. Clone the repo
   ```sh
   git clone git@github.com:iamrobzy/music-benchmarking.git
   ```
2. Install required packages in virtual environment
   ```
   python -m venv .venv
   source .venv/bin.activate
   pip install -r requirements.txt
   ```
3. Follow the instructions in the [`./app`](./app) directory to host the UI locally and deploy the GPU inference server.

## Note:

All components of this project function correctly seperately - however complete integration between components is unfinished. For example, serverless GPU inference works for only some ONNX models handling pre-processing identically. Other models with different pre-processing were not handled in time. 

Also, due to large ONNX model sizes, these are not included in the repository. Instead, their training and exporting scripts are included under the `model_training` directory.
git ignore a
<!-- CONTACT -->
## Contributors:
- **Adrian Pang**
  - Contributions: built entirety of UI.
  - Learnings: architecture designing, front-end/backend, metric calculation from logits.
- **Robert Skoglund**
  - Contributions: built inference server, designed project architecture.
  - Learnings: leveraging SLURM, BASH, Docker for GPU training. Serverless GPU inference with Modal. Modal hosting with HuggingFace (HF), ONNX formatting.
- **Michalina Janik**
  - Contributions: model design/training/evaluation.
  - Learnings: Deploying models on web servers, Neural Parallel model architecture.
- **Wang Jiyu**
  - Contributions: model training, environment configuration, data pre-processing.
  - Learnings: HuggingFace Transformers, model architectures.