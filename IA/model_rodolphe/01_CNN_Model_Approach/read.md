# README - Reconnaissance des Expressions Faciales avec CNN

## Introduction
Ce projet utilise un réseau de neurones convolutionnel (CNN) pour la classification des expressions faciales en 7 catégories distinctes. L'objectif est de construire un modèle efficace capable de reconnaître les émotions humaines à partir d'images en niveaux de gris (48x48 pixels).

## Dépendances
Avant d'exécuter le code, assurez-vous d'installer les bibliothèques nécessaires :

```bash
pip install mtcnn lz4 tensorflow keras matplotlib seaborn opencv-python
```

## Structure du Code
Le code est divisé en plusieurs étapes clés :

1. **Chargement des bibliothèques**
2. **Préparation des données** (chargement, augmentation et division des ensembles d'entraînement et de validation)
3. **Construction du modèle CNN**
4. **Compilation et entraînement du modèle**
5. **Visualisation des performances**

## Préparation des données
Les images sont stockées dans deux répertoires :

- `dataset/train` : Contient les images pour l'entraînement
- `dataset/test` : Contient les images pour le test

Nous utilisons `ImageDataGenerator` pour normaliser les images et appliquer des transformations d'augmentation (shift, flip, rescaling).

## Architecture du Modèle CNN
Le modèle est construit en plusieurs couches, chacune ayant un rôle spécifique :

1. **Couche d'entrée :**
   - `Input(shape=(48,48,1))` : Définit la taille de l'image d'entrée.

2. **Bloc Convolutionnel 1 :**
   - `Conv2D(64, (3,3), activation='relu', padding='same')` : Convolution avec 64 filtres pour extraire les caractéristiques.
   - `BatchNormalization()` : Normalisation des activations pour accélérer l'apprentissage.
   - `MaxPooling2D(2,2)` : Réduction de la dimension spatiale.
   - `Dropout(0.25)` : Réduit le sur-apprentissage.

3. **Bloc Convolutionnel 2 :**
   - `Conv2D(128, (5,5), activation='relu', padding='same')`
   - `BatchNormalization()`
   - `MaxPooling2D(2,2)`
   - `Dropout(0.25)`

4. **Bloc Convolutionnel 3 :**
   - `Conv2D(512, (3,3), activation='relu', padding='same', kernel_regularizer=l2(0.01))` : Régularisation L2 pour éviter l'overfitting.
   - `BatchNormalization()`
   - `MaxPooling2D(2,2)`
   - `Dropout(0.25)`

5. **Bloc Convolutionnel 4 :**
   - `Conv2D(512, (3,3), activation='relu', padding='same', kernel_regularizer=l2(0.01))`
   - `BatchNormalization()`
   - `MaxPooling2D(2,2)`
   - `Dropout(0.25)`

6. **Flatten et Couches Denses :**
   - `Flatten()` : Transformation des cartes de caractéristiques en un vecteur.
   - `Dense(256, activation='relu')` : Apprentissage de caractéristiques abstraites.
   - `BatchNormalization()`
   - `Dropout(0.25)`
   - `Dense(512, activation='relu')`
   - `BatchNormalization()`
   - `Dropout(0.25)`

7. **Couche de sortie :**
   - `Dense(7, activation='softmax')` : Prédit les probabilités pour chaque classe d'émotion.

## Compilation et Entraînement
Le modèle est compilé avec :

```python
optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)
model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])
```

Il est ensuite entraîné sur 70 époques avec validation et callbacks pour l'amélioration automatique :

```python
history = model.fit(x=train_generator, epochs=70, validation_data=validation_generator, callbacks=callbacks)
```

## Callbacks Utilisés
- **ModelCheckpoint** : Sauvegarde le meilleur modèle basé sur `val_accuracy`.
- **EarlyStopping** : Arrête l'entraînement si `val_loss` ne s'améliore plus après 10 époques.
- **ReduceLROnPlateau** : Réduit le taux d'apprentissage si `val_loss` stagne.

## Conclusion
Ce CNN est conçu pour capturer efficacement les caractéristiques des émotions faciales. Grâce à une architecture bien équilibrée, il offre une bonne capacité de généralisation tout en évitant le sur-apprentissage.

