import os
import random
import shutil

# Пути к папкам
train_images_path = '/Users/darius/Documents/projects/cyber-drones/ml/fire-detection/Fire-Detection-1/train/images'
train_labels_path = '/Users/darius/Documents/projects/cyber-drones/ml/fire-detection/Fire-Detection-1/train/labels'
valid_images_path = '/Users/darius/Documents/projects/cyber-drones/ml/fire-detection/Fire-Detection-1/valid/images'
valid_labels_path = '/Users/darius/Documents/projects/cyber-drones/ml/fire-detection/Fire-Detection-1/valid/labels'


# Получение списка файлов изображений
images = os.listdir(train_images_path)
images = [img for img in images if img.endswith('.jpg') or img.endswith('.png')]

# Выбор случайных 20% изображений для валидации
random.shuffle(images)
valid_size = int(len(images) * 0.2)
valid_images = images[:valid_size]

for img in valid_images:

    shutil.move(os.path.join(train_images_path, img), os.path.join(valid_images_path, img))

    # Перемещение меток
    label = img.replace('.jpg', '.txt').replace('.png', '.txt')
    shutil.move(os.path.join(train_labels_path, label), os.path.join(valid_labels_path, label))