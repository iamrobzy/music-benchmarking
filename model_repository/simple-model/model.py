import torch
import torch.nn as nn

class AudioClassifier(nn.Module):
    def __init__(self, input_size, num_classes):
        super(AudioClassifier, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)  # First fully-connected layer
        self.fc2 = nn.Linear(128, num_classes)  # Output layer

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# Example: Create model instance for 10 classes with a 16000 sample input (1 second at 16 kHz)
num_classes = 10
input_size = 160000  # Adjust based on audio sample rate and length
model = AudioClassifier(input_size=input_size, num_classes=num_classes)

import torch.onnx

# Dummy input for ONNX export
dummy_input = torch.randn(1, input_size)  # Batch size of 1, input size as defined
onnx_path = "./simple-model.onnx"

# Export the model
torch.onnx.export(model, dummy_input, onnx_path,
                  input_names=['audio_input'],
                  output_names=['output'],
                  dynamic_axes={'audio_input': {0: 'batch_size'}, 'output': {0: 'batch_size'}})
print(f"Model exported to {onnx_path}")