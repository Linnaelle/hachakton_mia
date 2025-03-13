# README - Reconnaissance Faciale avec InceptionV3 et SVM

## Introduction
Ce projet vise la reconnaissance des émotions faciales en utilisant un modèle pré-entraîné **InceptionV3** pour extraire les caractéristiques des images, suivi d'un entraînement classique avec une **couche dense** pour la classification. Ensuite, nous utilisons un **SVM (Support Vector Machine)** comme méthode alternative pour la classification des caractéristiques extraites du modèle CNN.

## Dépendances et Installation

Avant d'exécuter le projet, assurez-vous d'installer les bibliothèques nécessaires :

```bash
pip install mtcnn lz4 opencv-python scikit-learn tensorflow keras matplotlib
```

## Structure du Code
Le projet est structuré en plusieurs étapes principales :

1. **Téléchargement et prétraitement des images**
2. **Détection et recadrage des visages avec MTCNN**
3. **Préparation des datasets avec `ImageDataGenerator`**
4. **Construction du modèle basé sur InceptionV3**
5. **Entraînement initial du modèle avec InceptionV3**
6. **Fine-tuning du modèle**
7. **Évaluation et courbes d'apprentissage**
8. **Utilisation d'un modèle SVM pour la classification des features**
9. **Analyse des performances avec une courbe d'apprentissage**

## 1. Prétraitement des Images
Le dataset **FER2013** est téléchargé depuis Kaggle, extrait, et stocké sous :

- `FER2013/train` : images pour l'entraînement
- `FER2013/test` : images pour le test

Les images sont ensuite **recadrées** pour ne conserver que les visages détectés grâce à **MTCNN**. Elles sont enregistrées dans :

- `cropped_train` : images recadrées pour l'entraînement
- `cropped_test` : images recadrées pour le test

## 2. Détection et Recadrage des Visages

Nous utilisons **MTCNN** pour détecter les visages et recadrer les images avant de les sauvegarder dans les nouveaux répertoires.

```python
def detect_and_crop_face(image_path, output_path, upscale_factor=1):
    img = cv2.imread(image_path)
    faces = detector.detect_faces(img)
    if len(faces) > 0:
        x, y, w, h = faces[0]['box']
        face_crop = img[y:y+h, x:x+w]
        cv2.imwrite(output_path, face_crop)
```

## 3. Préparation des Données avec `ImageDataGenerator`

Nous appliquons de l'**augmentation de données** et un **redimensionnement** des images à 299x299 (InceptionV3 attend cette taille) :

```python
train_datagen = ImageDataGenerator(
    rescale=1./255,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True,
    validation_split=0.2
)
```

## 4. Construction du Modèle CNN avec InceptionV3

Nous utilisons **InceptionV3** en retirant sa dernière couche (`include_top=False`), puis nous ajoutons :

- **GlobalAveragePooling2D()** : réduit les dimensions des features extraites
- **Dropout(0.5)** : pour éviter l'overfitting
- **Dense(7, activation='softmax')** : couche finale pour classer les 7 émotions

```python
base_inception = InceptionV3(include_top=False, weights='imagenet', input_shape=(299, 299, 3))
for layer in base_inception.layers:
    layer.trainable = False
x = base_inception.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.5)(x)
predictions = Dense(7, activation='softmax')(x)
model_inception = Model(inputs=base_inception.input, outputs=predictions)
```

## 5. Entraînement Initial du Modèle

Nous entraînons le modèle sur **10 époques** avec un taux d'apprentissage initial de **1e-4**.

```python
history_initial = model_inception.fit(
    train_generator,
    epochs=10,
    validation_data=validation_generator,
    callbacks=callbacks
)
```

## 6. Fine-Tuning du Modèle

Une fois l'entraînement initial terminé, nous **dégelons certaines couches profondes** du réseau et entraînons à nouveau avec un taux d'apprentissage réduit (**1e-5**).

```python
fine_tune_start = 200
for layer in base_inception.layers[fine_tune_start:]:
    layer.trainable = True
model_inception.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
```

Nous ré-entraînons le modèle sur **10 époques supplémentaires**.

## 7. Évaluation et Visualisation des Performances

Nous affichons les **courbes d'apprentissage** :

```python
plt.plot(epochs, loss, 'b-', label='Training Loss')
plt.plot(epochs, val_loss, 'r-', label='Validation Loss')
plt.axvline(x=best_epoch, color='g', linestyle='--', label=f'Meilleur modèle (epoch {best_epoch})')
```

## 8. Classification des Features avec un SVM

Nous extrayons les features de la couche avant `Dense(7)`, et entraînons un **SVM** dessus :

```python
features_model = Model(inputs=model_inception.input, outputs=model_inception.layers[-2].output)
train_features = features_model.predict(train_generator)
test_features = features_model.predict(test_generator)
```

Nous entraînons ensuite un **SVM avec GridSearchCV** pour optimiser ses hyperparamètres :

```python
parameters = {'C': [0.1, 1, 10], 'kernel': ['linear', 'rbf']}
svc = SVC()
clf = GridSearchCV(svc, param_grid=parameters, scoring='accuracy', cv=5, n_jobs=-1)
clf.fit(train_features, train_labels_idx)
```

Le meilleur modèle est sauvegardé avec **Joblib** :

```python
joblib.dump(clf.best_estimator_, "svm_best.joblib")
```

## 9. Analyse des Performances du SVM

Nous affichons la **courbe d'apprentissage du SVM** :

```python
plt.plot(train_sizes, train_scores_mean, 'o-', color='r', label='Précision entraînement')
plt.plot(train_sizes, test_scores_mean, 'o-', color='g', label='Précision cross-validation')
```

## Conclusion

Ce projet montre deux approches pour la classification des émotions faciales :

1. **CNN basé sur InceptionV3** pour extraire des features et classifier directement.
2. **SVM sur les features extraites** pour une classification optimisée.

Le fine-tuning améliore la précision du modèle, et l'utilisation du **SVM permet d'explorer une autre méthode de classification efficace**.

