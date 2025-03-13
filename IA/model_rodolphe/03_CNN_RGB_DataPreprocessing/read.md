# README - Prétraitement des Données pour CNN en RGB

## Introduction
Ce projet vise le **prétraitement de données d'images en RGB** afin de les rendre exploitables pour l'entraînement d'un modèle CNN (Convolutional Neural Network). Nous utilisons le dataset **AffectNet** contenant des images d'expressions faciales classées en plusieurs émotions. Ce projet inclut l'installation des dépendances, le téléchargement et le traitement des données, ainsi que l'optimisation du pipeline de traitement.

## Objectifs du Projet
- **Téléchargement et gestion des données AffectNet**
- **Détection et recadrage des visages avec MTCNN et RetinaFace**
- **Prétraitement et augmentation des données (redimensionnement, conversion en niveaux de gris)**
- **Optimisation du pipeline avec traitement parallèle**
- **Sauvegarde et persistance des données traitées**

## Dépendances et Installation

Assurez-vous d'installer les bibliothèques requises :

```bash
pip install tensorflow kagglehub insightface onnxruntime-gpu opencv-python numpy torch torchvision facenet-pytorch retina-face tea
```

## 1. Compilation d'OpenCV avec Support CUDA
Pour une meilleure accélération matérielle, OpenCV est compilé avec CUDA :

```bash
apt-get update
apt-get install -y build-essential cmake git pkg-config libgtk-3-dev libavcodec-dev libavformat-dev libswscale-dev
apt-get install -y libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev
```

Puis nous clonons OpenCV et compilons avec les options d'optimisation GPU :

```bash
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git
mkdir -p opencv/build
cd opencv/build && cmake -D WITH_CUDA=ON -D OPENCV_DNN_CUDA=ON ..
cd opencv/build && make -j$(nproc)
cd opencv/build && sudo make install && sudo ldconfig
```

## 2. Téléchargement du Dataset AffectNet
Nous utilisons **KaggleHub** pour télécharger et extraire les images :

```bash
kaggle datasets download lintongdai/affectnet7 -p /content/affectnet7
unzip -q /content/affectnet7/affectnet7.zip -d /content/affectnet
```

## 3. Analyse des Données
Nous chargeons les annotations CSV et explorons la distribution des émotions :

```python
df = pd.read_csv('/content/affectnet/affectnet.csv')
print(df.head())
print(df['label'].value_counts())
```

Nous visualisons la structure des dossiers et le nombre d'images par catégorie :

```python
import os
for category in sorted(os.listdir('affectnet/train')):
    print(f"Catégorie {category}: {len(os.listdir(os.path.join('affectnet/train', category)))} images")
```

## 4. Détection et Recadrage des Visages
Nous utilisons **MTCNN** et **RetinaFace** pour détecter et recadrer les visages avec une marge de sécurité :

```python
def detect_and_crop(image_path):
    img = cv2.imread(image_path)
    boxes, _ = mtcnn.detect(img)
    if boxes is None:
        return None
    best_box = max(boxes, key=lambda b: (b[2]-b[0]) * (b[3]-b[1]))
    return crop_with_margin(img, best_box, margin=0.3)
```

Les images sont ensuite redimensionnées en **48x48** pixels et converties en niveaux de gris.

## 5. Traitement Parallèle des Images
Pour accélérer le processus, nous utilisons **ThreadPoolExecutor** :

```python
from concurrent.futures import ThreadPoolExecutor

def process_images_in_batches(input_dir, output_dir, batch_size=50, max_workers=4):
    os.makedirs(output_dir, exist_ok=True)
    tasks = [(os.path.join(input_dir, img), os.path.join(output_dir, img)) for img in os.listdir(input_dir)]
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(process_image, tasks)
```

## 6. Sauvegarde et Persistance des Données
Les images traitées sont compressées et sauvegardées :

```bash
zip -r affectnet_processed.zip affectnet_processed_pytorch
```

Puis nous transférons les fichiers vers Google Drive :

```python
from google.colab import drive
drive.mount('/content/drive')
shutil.move('affectnet_processed.zip', '/content/drive/MyDrive/')
```

## 7. Visualisation des Images
Nous affichons quelques exemples d’images après traitement :

```python
for i in range(5):
    img_path = df.loc[i, 'img_path']
    label = df.loc[i, 'label']
    img = cv2.imread(img_path)
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.title(f"Label: {emotion_dict[label]}")
    plt.show()
```

## Conclusion
Ce projet met en place un pipeline optimisé pour le **prétraitement des images AffectNet**, incluant **détection des visages, recadrage, redimensionnement, conversion en niveaux de gris et traitement parallèle**. Ces étapes permettent de préparer efficacement les données pour l’entraînement d’un modèle CNN.

🚀 **Prêt pour l'étape suivante : l'entraînement du modèle !**

