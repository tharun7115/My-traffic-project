import torch
from torchvision import transforms
from PIL import Image
import os

# Load model
class TrafficCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(32*56*56, 5)
        )

    def forward(self, x):
        return self.network(x)

# Load trained model
model = TrafficCNN()
model.load_state_dict(torch.load('ai_model/model.pth'))
model.eval()

# Define classes
classes = ['accident', 'flood', 'roadblock', 'public_event', 'clear']

# Predict function
def predict_cause(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])

    image = Image.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
        return classes[predicted.item()]