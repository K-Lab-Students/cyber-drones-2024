from ultralytics import YOLO
from roboflow import Roboflow
import torch

# Загрузка датасета с Roboflow
rf = Roboflow(api_key="KdzwPt1kMDiWW0rj6uv7")
project = rf.workspace("fire-dataset-tp9jt").project("fire-detection-sejra")
version = project.version(1)
dataset = version.download("yolov8")

# Путь к данным
data_path = dataset.location + "/data.yaml"

# Проверка доступности MPS
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')

model = YOLO('yolov8n.pt').to(device)

epochs = 50
model.train(data=data_path, epochs=epochs, imgsz=640)

# Оценка модели
model.val()

# Использование модели для предсказаний на новом изображении
results = model.predict('./test/image.jpg')
results.show()