<!-- PROJECT LOGO -->
<a id="readme-top"></a>
<br />
  <h3 align="center">Music-Tagging and Genre-Classification Platform</h3>
  <p align="center">
    A platform for evaluating music-tagging and genre-classification models
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
    </ul>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## Project Details

This platform addresses the lack of standardized comparison tools for music-tagging and genre-classification models. It allows users to upload and evaluate models using different datasets.

Key features:
- Upload and evaluate music models using a user-friendly interface.
- Fine-tune and test various models, including AST, Audio Mamba, and more.
- Repository of popular music information retrieval datasets.

## Datasets

- [Free Music Archive (FMA)](https://github.com/mdeff/fma?tab=readme-ov-file)
- [MTG-Jamendo Dataset](https://github.com/MTG/mtg-jamendo-dataset)


<!-- FOLDER STRUCTURE -->
## Folder Structure

```
music-benchmarking/
├── .gitignore                  # Specify files/folders to be ignored by Git
├── README.md                   # Project overview and instructions
├── LICENSE                     # License information
├── requirements.txt            # Python dependencies
├── setup.py                    # Setup script for package installation
├── app/                        # Application components
│   ├── backend/                # Backend implementation with Flask
│   ├── frontend/               # Frontend implementation with React
│   └── README.md               # Instructions on how to run the app
│
├── datasets/                   # Datasets for model evaluation
│   ├── README.md               # Overview of datasets used
│   ├── gtzan/                  # GTZAN dataset files
│   ├── huggingface/            # HuggingFace datasets references
│   └── custom/                 # Custom datasets (if any)
│
├── model_references/           # References to externally hosted models
│   ├── README.md               # Overview of model links and usage
│   ├── ast.md                  # Link to Audio Spectrogram Transformers
│   ├── audio_mamba.md          # Link to Audio Mamba models
│   ├── cnn.md                  # Link to Simple CNN-based models
│   └── gnn.md                  # Link to Audio-Tagging GNN models
│
├── model_evaluation/           # Scripts for model evaluation
│   ├── evaluate.py             # Script to evaluate models
│   ├── metrics.py              # Custom metrics for evaluation
│   └── results/                # Folder to store evaluation results
│
├── model_training/             # Scripts for model training and fine-tuning
│   ├── ast/                    # AST-specific training scripts
│   │   ├── train_ast.py        # Training script for AST
│   │   ├── finetune_ast.py     # Fine-tuning script for AST
│   │   └── config_ast.yaml     # Configuration for AST training
│   ├── audio_mamba/            # Audio Mamba training scripts
│   │   ├── train_audio_mamba.py
│   │   ├── finetune_audio_mamba.py
│   │   └── config_audio_mamba.yaml
│   ├── cnn/                    # CNN-based model training scripts
│   │   ├── train_cnn.py
│   │   ├── finetune_cnn.py
│   │   └── config_cnn.yaml
│   └── gnn/                    # GNN model training scripts (if available)
│       ├── train_gnn.py
│       ├── finetune_gnn.py
│       └── config_gnn.yaml

```

<!-- GETTING STARTED -->
## Getting Started

To set up this project locally, follow these steps:

### Prerequisites
* Python 3.x
* Install dependencies:
  ```sh
  pip install -r requirements.txt
  ```

### Installation
1. Clone the repo
   ```sh
   git clone git@github.com:iamrobzy/music-benchmarking.git
   ```
2. Install required packages
   ```sh
   pip install -r requirements.txt
   ```
3. Set up environment variables or API keys if necessary.

<!-- USAGE EXAMPLES -->
## Usage

This platform provides a UI to upload models, select datasets, and evaluate model performance. It supports the evaluation of different pre-trained models, with options for fine-tuning.

Explain here how to start.

<!-- ROADMAP -->
## Roadmap

- [x] Add model evaluation and training scripts
- [ ] Implement support for more models
- [ ] Add dataset preprocessing modules


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->
## Contact

Contributors:
- Adrian Pang
- Robert Skoglund
- Wang Jiyu
- Michalina Janik
