# Music Task Benchmarking

There exists no standardized platform to compare models for music-tagging and genre-classification - so we create a platform ourselves.

## Project directory structure
```
music-benchmarking/
├── .gitignore                  # Specify files/folders to be ignored by Git
├── README.md                   # Project overview and instructions
├── LICENSE                     # License information
├── requirements.txt            # Python dependencies
├── setup.py                    # Setup script for package installation
├── ui/                         # User Interface components
│   ├── app.py                  # Main application script
│   ├── templates/              # HTML templates for the UI
│   └── static/                 # Static files (CSS, JS, images)
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
│
└── docs/                       # Documentation
    ├── setup_guide.md          # Setup and installation guide
    └── usage_guide.md          # Usage instructions for the platform
```
