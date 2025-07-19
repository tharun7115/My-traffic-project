import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
import os

# --- 1. Setup and Configuration ---
# Define paths
dataset_path = 'dataset_small'
model_save_path = 'traffic_image_classifier.pth'

# Define transformations for the images
# This will resize, crop, and normalize the images to match what the model expects
data_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

print("Loading image dataset...")
# Load the dataset from folders
image_dataset = datasets.ImageFolder(os.path.join(dataset_path), data_transforms)
dataloader = torch.utils.data.DataLoader(image_dataset, batch_size=4, shuffle=True)

# Get class names (accident, heavy_traffic, etc.)
class_names = image_dataset.classes
num_classes = len(class_names)
print(f"Found {num_classes} classes: {class_names}")


# --- 2. Load a Pre-trained Model (ResNet18) ---
print("Loading pre-trained ResNet18 model...")
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# Freeze all the model parameters so we don't train them from scratch
for param in model.parameters():
    param.requires_grad = False

# Replace the final layer (the classifier) with a new one for our specific classes
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, num_classes)


# --- 3. Train the Model ---
criterion = nn.CrossEntropyLoss()
# We only train the parameters of the final layer
optimizer = optim.SGD(model.fc.parameters(), lr=0.001, momentum=0.9)

print("Starting training...")
num_epochs = 10  # You can increase this for better accuracy
for epoch in range(num_epochs):
    running_loss = 0.0
    for inputs, labels in dataloader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * inputs.size(0)
    
    epoch_loss = running_loss / len(image_dataset)
    print(f'Epoch {epoch+1}/{num_epochs} Loss: {epoch_loss:.4f}')

print("Training complete.")


# --- 4. Save the Model ---
# Save the class names along with the model state
model_data = {
    'model_state_dict': model.state_dict(),
    'class_names': class_names
}
torch.save(model_data, model_save_path)
print(f"Model saved to {model_save_path}")