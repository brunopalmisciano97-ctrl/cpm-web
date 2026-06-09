from PIL import Image
img = Image.open(r"C:\Users\Usuario\cpm-web\img\estudio\main.jpg")
img.save(r"C:\Users\Usuario\cpm-web\img\estudio\main.jpg", quality=75, optimize=True)
print("Comprimida: main.jpg")
