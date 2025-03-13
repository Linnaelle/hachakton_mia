# README - Fine-tuning d'un Modèle CNN pour la Reconnaissance Faciale

## Introduction
Ce projet porte sur le **fine-tuning d'un modèle CNN** afin d'améliorer la reconnaissance des émotions faciales à partir d'images. Il combine plusieurs étapes essentielles, notamment :
- **Le chargement et la fusion de datasets** (AffectNet & FER2013)
- **Le prétraitement et la structuration des données**
- **Le fine-tuning d'un modèle CNN pré-entraîné**
- **L'entraînement en plusieurs phases pour une meilleure généralisation**
- **L'évaluation et la visualisation des performances**

## 1. Installation des Packages Nécessaires

Avant d'exécuter le projet, assurez-vous d'installer les dépendances suivantes :

```bash
pip install mtcnn lz4 tensorflow opencv-python numpy pandas seaborn torch torchvision facenet-pytorch keras
```

## 2. Vérification du GPU

Le projet exploite la puissance du GPU pour accélérer l'entraînement. Vérifiez la disponibilité du GPU avec :

```python
import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
print("GPU disponibles :", gpus)
print("GPU utilisé :", tf.test.gpu_device_name())
```

## 3. Préparation des Données

Le dataset **AffectNet** est téléchargé et structuré sous la forme suivante :

```
dataset_2/
├── train/
│   ├── 0 (neutral)
│   ├── 1 (happy)
│   ├── 2 (sad)
│   ├── 3 (surprise)
│   ├── 4 (fear)
│   ├── 5 (disgust)
│   └── 6 (angry)
└── val/
    ├── 0
    ├── 1
    ├── 2
    ├── 3
    ├── 4
    ├── 5
    ├── 6
```

Les images sont extraites et normalisées pour l'entraînement.

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

train_datagen = ImageDataGenerator(
    rescale=1./255,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)
```

## 4. Chargement et Fine-Tuning du Modèle CNN

Nous chargeons un modèle CNN pré-entraîné (`best_model.h5`) et ajoutons de nouvelles couches pour affiner ses performances :

```python
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Input

old_model = load_model('best_model.h5')
new_input = Input(shape=(48, 48, 1))

x = new_input
for layer in old_model.layers[:-1]:
    layer.trainable = False  # Geler les couches existantes
    x = layer(x)

x = Dense(256, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
new_output = Dense(7, activation='softmax')(x)

new_model = Model(new_input, new_output)
```

## 5. Compilation et Entraînement du Modèle

Nous entraînons le modèle en **deux phases** :
1. **Phase 1 :** Apprentissage des nouvelles couches avec la base gelée.
2. **Phase 2 :** Fine-tuning en débloquant partiellement les couches du CNN.

```python
from tensorflow.keras.optimizers import Adam

# Phase 1 - Base gelée
new_model.compile(optimizer=Adam(learning_rate=1e-4), loss='categorical_crossentropy', metrics=['accuracy'])
history_phase1 = new_model.fit(train_generator, epochs=10, validation_data=val_generator)

# Phase 2 - Fine-tuning
for layer in old_model.layers[-4:]:
    layer.trainable = True
new_model.compile(optimizer=Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
history_phase2 = new_model.fit(train_generator, epochs=20, validation_data=val_generator)
```

## 6. Visualisation des Performances

Nous affichons les courbes de **précision et de perte** pour suivre l'évolution de l'entraînement :

```python
import matplotlib.pyplot as plt

plt.plot(history_phase2.history['accuracy'], label='Train')
plt.plot(history_phase2.history['val_accuracy'], label='Validation')
plt.xlabel('Époques')
plt.ylabel('Précision')
plt.legend()
plt.show()
```

## 7. Fusion des Datasets (AffectNet + FER2013)

Nous avons fusionné **AffectNet** et **FER2013** pour enrichir l'entraînement.

```python
import shutil

fer2013 = 'FER2013'
dataset2 = 'dataset_2'
nouveau_dataset = 'merged_dataset'
train_dir = os.path.join(nouveau_dataset, 'train')
test_dir = os.path.join(nouveau_dataset, 'test')

os.makedirs(train_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)
```

Les images de chaque catégorie sont copiées dans la nouvelle structure.

```python
def copier_images(src_dossier, dst_dossier):
    for filename in os.listdir(src_dossier):
        chemin_src = os.path.join(src_dossier, filename)
        chemin_dst = os.path.join(dst_dossier, filename)
        shutil.copy(chemin_src, chemin_dst)
```

Après fusion, nous créons une **archive ZIP** du dataset final :

```bash
zip -r merged_dataset.zip merged_dataset
```

## 8. Sauvegarde et Exportation du Modèle Final

Après l'entraînement, nous sauvegardons le modèle affiné pour une utilisation future :

```python
new_model.save('final_model_updated.h5')
```

## Conclusion

Ce projet illustre un **processus avancé de fine-tuning d'un modèle CNN** en exploitant des bases de données enrichies pour améliorer la reconnaissance des émotions faciales.

🚀 **Prêt pour le déploiement et l'utilisation en production !**

