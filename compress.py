from PIL import Image
import os
from pathlib import Path

folder = r"C:\Users\Usuario\cpm-web\img\obra-bunker"
for filename in os.listdir(folder):
    if filename.endswith((".jpg", ".jpeg", ".png")):
        filepath = os.path.join(folder, filename)
        try:
            img = Image.open(filepath)
            img.save(filepath, quality=75, optimize=True)
            print(f"Comprimido: {filename}")
        except Exception as e:
            print(f"Error en {filename}: {e}")
