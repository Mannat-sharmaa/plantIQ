"""
PlantIQ - Deep Learning Disease Classification Training Pipeline
Architecture: EfficientNet-B4 / ResNet-50 Transfer Learning with Albumentations
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image

class PlantFoliarDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img = Image.open(self.image_paths[idx]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        label = self.labels[idx]
        return img, label

def get_model(num_classes=4, pretrained=True):
    # Load EfficientNet backbone
    model = models.efficientnet_b4(weights=models.EfficientNet_B4_Weights.DEFAULT if pretrained else None)
    in_features = model.classifier[1].in_features
    # Replace classifier head for plant disease classes
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, num_classes)
    )
    return model

def train_one_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in dataloader:
        inputs = inputs.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, preds = torch.max(outputs, 1)
        correct += torch.sum(preds == labels.data).item()
        total += labels.size(0)

    epoch_loss = running_loss / max(total, 1)
    epoch_acc = correct / max(total, 1)
    return epoch_loss, epoch_acc

if __name__ == "__main__":
    print("🌱 PlantIQ: Classifier Training Pipeline Initialized.")
    print("Device: CUDA" if torch.cuda.is_available() else "Device: CPU")
    print("Model Architecture: EfficientNet-B4 (Pretrained ImageNet-1k)")
    print("Ready for dataset ingestion from ml/datasets/.")
