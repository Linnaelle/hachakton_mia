import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Conv2D, BatchNormalization
from tensorflow.keras.layers import MaxPooling2D, Dropout, Flatten, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping
from tensorflow.keras.regularizers import l2
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns

# Définir les paramètres
img_width, img_height = 48, 48
batch_size = 64
epochs = 50
num_classes = 7

# Chemins de données
train_dir = '/chemin/vers/dataset/train'
test_dir = '/chemin/vers/dataset/test'

# Définir l'augmentation de données équilibrée
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.15,
    height_shift_range=0.15,
    horizontal_flip=True,
    zoom_range=0.15,
    shear_range=0.15,
    validation_split=0.2
)

test_datagen = ImageDataGenerator(rescale=1./255)

# Générateurs de données
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_width, img_height),
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='categorical',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_width, img_height),
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='categorical',
    subset='validation'
)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(img_width, img_height),
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='categorical',
    shuffle=False
)

# Classes
class_indices = train_generator.class_indices
class_names = list(class_indices.keys())
print(f"Classes: {class_names}")

# Calculer les poids des classes pour gérer le déséquilibre
class_weights = {}
total_samples = train_generator.samples
n_classes = len(class_indices)
for class_idx, class_name in enumerate(class_names):
    class_count = len(os.listdir(os.path.join(train_dir, class_name)))
    weight = (1 / class_count) * (total_samples / n_classes)
    class_weights[class_idx] = weight

print("Poids des classes:", class_weights)

# Modèle CNN personnalisé avec des techniques modernes
def create_custom_cnn():
    model = Sequential([
        # Premier bloc
        Conv2D(64, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001),
               input_shape=(img_width, img_height, 1)),
        BatchNormalization(),
        Conv2D(64, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Deuxième bloc
        Conv2D(128, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        Conv2D(128, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Troisième bloc
        Conv2D(256, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        Conv2D(256, (3, 3), padding='same', activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Couches entièrement connectées
        Flatten(),
        Dense(512, activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        Dropout(0.5),
        Dense(256, activation='relu', kernel_regularizer=l2(0.001)),
        BatchNormalization(),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
    
    return model

# Créer et compiler le modèle CNN
custom_model = create_custom_cnn()
custom_model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks pour l'entraînement
checkpoint = ModelCheckpoint(
    'emotion_custom_best.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.2,
    patience=4,
    min_lr=0.00001,
    verbose=1
)

early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=10,
    verbose=1,
    restore_best_weights=True
)

callbacks = [checkpoint, reduce_lr, early_stopping]

# Entraîner le modèle CNN personnalisé
custom_history = custom_model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // batch_size,
    epochs=epochs,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // batch_size,
    callbacks=callbacks,
    class_weight=class_weights
)

# Évaluer le modèle CNN personnalisé
custom_eval = custom_model.evaluate(test_generator)
print(f'CNN personnalisé - Test loss: {custom_eval[0]:.4f}, Test accuracy: {custom_eval[1]:.4f}')

# Sauvegarder le modèle CNN
custom_model.save('emotion_custom_model.h5')

# Créer un modèle ResNet50 adapté aux images en niveaux de gris
def create_resnet_model():
    # Adapter les images en niveaux de gris en entrée
    input_tensor = Input(shape=(img_width, img_height, 1))
    # Dupliquer le canal pour obtenir 3 canaux (requis par ResNet)
    x = Conv2D(3, (1, 1), padding='same')(input_tensor)
    
    # Charger le modèle pré-entraîné sans la couche de classification
    base_model = ResNet50(weights='imagenet', include_top=False, input_tensor=x)
    
    # Geler toutes les couches sauf les 20 dernières
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Ajouter les couches de classification
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu', kernel_regularizer=l2(0.001))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu', kernel_regularizer=l2(0.001))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=input_tensor, outputs=predictions)
    return model

# Créer et compiler le modèle ResNet
resnet_model = create_resnet_model()
resnet_model.compile(
    optimizer=Adam(learning_rate=0.00005),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks pour l'entraînement de ResNet
resnet_checkpoint = ModelCheckpoint(
    'emotion_resnet_best.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)

resnet_reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.2,
    patience=3,
    min_lr=0.000001,
    verbose=1
)

resnet_early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=8,
    verbose=1,
    restore_best_weights=True
)

resnet_callbacks = [resnet_checkpoint, resnet_reduce_lr, resnet_early_stopping]

# Entraîner le modèle ResNet
resnet_history = resnet_model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // batch_size,
    epochs=20,  # Moins d'époques pour le transfer learning
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // batch_size,
    callbacks=resnet_callbacks,
    class_weight=class_weights
)

# Évaluer le modèle ResNet
resnet_eval = resnet_model.evaluate(test_generator)
print(f'ResNet - Test loss: {resnet_eval[0]:.4f}, Test accuracy: {resnet_eval[1]:.4f}')

# Sauvegarder le modèle ResNet
resnet_model.save('emotion_resnet_model.h5')

# Ensemble (moyenne des prédictions)
def ensemble_predict(models, data_generator):
    predictions = []
    for model in models:
        pred = model.predict(data_generator)
        predictions.append(pred)
    
    # Calculer la moyenne des prédictions
    avg_pred = np.mean(predictions, axis=0)
    return avg_pred

# Faire des prédictions d'ensemble
ensemble_models = [custom_model, resnet_model]
ensemble_predictions = ensemble_predict(ensemble_models, test_generator)
ensemble_classes = np.argmax(ensemble_predictions, axis=1)

# Obtenir les vraies étiquettes
true_classes = test_generator.classes

# Calculer la précision de l'ensemble
from sklearn.metrics import accuracy_score
ensemble_accuracy = accuracy_score(true_classes, ensemble_classes)
print(f"Précision de l'ensemble: {ensemble_accuracy:.4f}")

# Afficher le rapport de classification pour l'ensemble
ensemble_report = classification_report(true_classes, ensemble_classes, target_names=class_names)
print("Rapport de classification pour l'ensemble:")
print(ensemble_report)

# Créer la matrice de confusion pour l'ensemble
def plot_confusion_matrix(y_true, y_pred, class_names):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('Matrice de confusion')
    plt.ylabel('Vraie étiquette')
    plt.xlabel('Étiquette prédite')
    plt.tight_layout()
    plt.savefig('ensemble_confusion_matrix.png')
    plt.show()

plot_confusion_matrix(true_classes, ensemble_classes, class_names)

# Visualiser quelques prédictions
def visualize_predictions(model, data_generator, class_names, num_samples=10):
    data_generator.reset()
    batch_x, batch_y = next(data_generator)
    predictions = model.predict(batch_x)
    
    fig, axes = plt.subplots(2, 5, figsize=(15, 6))
    axes = axes.flatten()
    
    for i in range(min(num_samples, len(batch_x))):
        img = batch_x[i].reshape(img_width, img_height)
        true_label = np.argmax(batch_y[i])
        pred_label = np.argmax(predictions[i])
        
        axes[i].imshow(img, cmap='gray')
        color = 'green' if true_label == pred_label else 'red'
        title = f"Vraie: {class_names[true_label]}\nPrédite: {class_names[pred_label]}"
        axes[i].set_title(title, color=color)
        axes[i].axis('off')
    
    plt.tight_layout()
    plt.savefig('prediction_examples.png')
    plt.show()

# Visualiser les prédictions de l'ensemble
def visualize_ensemble_predictions(models, data_generator, class_names, num_samples=10):
    data_generator.reset()
    batch_x, batch_y = next(data_generator)
    
    # Obtenir les prédictions de chaque modèle
    model_predictions = []
    for model in models:
        preds = model.predict(batch_x)
        model_predictions.append(preds)
    
    # Moyenne des prédictions
    ensemble_preds = np.mean(model_predictions, axis=0)
    
    fig, axes = plt.subplots(2, 5, figsize=(15, 6))
    axes = axes.flatten()
    
    for i in range(min(num_samples, len(batch_x))):
        img = batch_x[i].reshape(img_width, img_height)
        true_label = np.argmax(batch_y[i])
        pred_label = np.argmax(ensemble_preds[i])
        
        axes[i].imshow(img, cmap='gray')
        color = 'green' if true_label == pred_label else 'red'
        title = f"Vraie: {class_names[true_label]}\nPrédite: {class_names[pred_label]}"
        axes[i].set_title(title, color=color)
        axes[i].axis('off')
    
    plt.tight_layout()
    plt.savefig('ensemble_prediction_examples.png')
    plt.show()

visualize_ensemble_predictions(ensemble_models, test_generator, class_names)

# Tracer les courbes d'apprentissage comparatives
plt.figure(figsize=(12, 4))

# Courbe de précision
plt.subplot(1, 2, 1)
plt.plot(custom_history.history['accuracy'], label='CNN Train')
plt.plot(custom_history.history['val_accuracy'], label='CNN Validation')
plt.plot(resnet_history.history['accuracy'], label='ResNet Train')
plt.plot(resnet_history.history['val_accuracy'], label='ResNet Validation')
plt.title('Précision des modèles')
plt.ylabel('Précision')
plt.xlabel('Epoch')
plt.legend(loc='lower right')

# Courbe de perte
plt.subplot(1, 2, 2)
plt.plot(custom_history.history['loss'], label='CNN Train')
plt.plot(custom_history.history['val_loss'], label='CNN Validation')
plt.plot(resnet_history.history['loss'], label='ResNet Train')
plt.plot(resnet_history.history['val_loss'], label='ResNet Validation')
plt.title('Perte des modèles')
plt.ylabel('Perte')
plt.xlabel('Epoch')
plt.legend(loc='upper right')

plt.tight_layout()
plt.savefig('learning_curves_comparison.png')
plt.show()