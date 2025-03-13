# hachakton_mia

# Partie Tweeter
Tweeter - Un Clone de Twitter
Tweeter est une application full-stack clone de Twitter qui permet aux utilisateurs de publier des tweets, de suivre d'autres utilisateurs, d'aimer et de retweeter du contenu, et d'interagir sur une plateforme de médias sociaux. Le projet est construit avec une stack technologique moderne et inclut des fonctionnalités comme l'authentification des utilisateurs, les notifications en temps réel et le téléchargement de médias.

🚀 Stack Technologique
Backend

Node.js & Express - Framework serveur
MongoDB - Base de données
GraphQL & Apollo Server - Couche API
Redis - Mise en cache et fonctionnalités en temps réel
JWT - Authentification
Bull - File d'attente pour les tâches en arrière-plan
WebSockets - Notifications en temps réel

Frontend

Next.js 15 - Framework React
TailwindCSS - Stylisation
Apollo Client - Client GraphQL
React Query - Récupération de données

Infrastructure

Docker & Docker Compose - Conteneurisation et orchestration des services

🔧 Structure du Projet

├── backend/                 # Serveur API Express + GraphQL
│   ├── src/                 # Code source
│   │   ├── config/          # Fichiers de configuration
│   │   ├── controllers/     # Contrôleurs API REST
│   │   ├── graphql/         # Schéma et résolveurs GraphQL
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── models/          # Modèles Mongoose
│   │   ├── queues/          # Files d'attente Bull
│   │   ├── routes/          # Routes Express
│   │   ├── services/        # Services de logique métier
│   │   └── utils/           # Fonctions utilitaires
│   ├── .env.example         # Exemple de variables d'environnement
│   ├── Dockerfile           # Configuration Docker
│   └── package.json         # Dépendances
│
├── frontend/                # Application Next.js
│   ├── app/                 # Routes et pages de l'application Next.js
│   │   ├── components/      # Composants React
│   │   ├── context/         # Fournisseurs de contexte React
│   │   ├── graphql/         # Requêtes et mutations GraphQL
│   │   └── type/            # Définitions de types TypeScript
│   ├── Dockerfile           # Configuration Docker pour le frontend
│   └── package.json         # Dépendances
│
└── docker-compose.yml       # Configuration Docker Compose

✨ Fonctionnalités

Authentification Utilisateur - Inscription, connexion, déconnexion, réinitialisation de mot de passe
Gestion des Tweets - Créer, aimer, commenter, retweeter
Profils Utilisateurs - Bio, photo de profil, abonnements/abonnés
Timeline - Fil d'actualité et fil du profil utilisateur
Téléchargements de Médias - Support d'images et de vidéos pour les tweets
Fonctionnalités en Temps Réel - Notifications et mises à jour en direct
Recherche - Recherche de tweets et d'utilisateurs
Mise en Cache - Optimisation des performances avec Redis

🛠️ Installation et Configuration
Prérequis

Docker et Docker Compose installés sur votre machine
Node.js (pour le développement local)

Utilisation de Docker Compose

 1.Cloner le dépôt

```bash
git clone https://github.com/votrenom/tweeter.git
cd tweeter
```
 2.Créer les fichiers d'environnement à partir des exemples

```bash
cp backend/.env.example backend/.env
```

 3.Démarrer l'application avec Docker Compose

```bash
docker-compose up -d
```

 4.L'application sera disponible aux adresses suivantes :

Frontend : http://localhost:3000
API Backend : http://localhost:5000
Interface GraphQL : http://localhost:5000/graphql
Interface MongoDB Express : http://localhost:8081

Configuration pour le Développement Local

 1.Installer les dépendances du backend

```bash
cd backend
npm install
```
 2.Installer les dépendances du frontend

```bash
cd frontend
npm install
```

 3.Démarrer MongoDB et Redis (en utilisant Docker ou une installation locale)
 4.Configurer les variables d'environnement dans les fichiers .env
 5.Démarrer le serveur backend

```bash
cd backend
npm run dev
```

 6.Démarrer l'application frontend

 ```bash
cd frontend
npm run dev
```

📝 Documentation de l'API
Points de Terminaison de l'API REST

Routes d'authentification :

POST /api/auth/register - Inscrire un nouvel utilisateur
POST /api/auth/login - Connexion
POST /api/auth/logout - Déconnexion
GET /api/auth/me - Obtenir l'utilisateur actuel
POST /api/auth/refresh-token - Rafraîchir le token JWT
POST /api/auth/forgot-password - Demander une réinitialisation de mot de passe
POST /api/auth/reset-password - Réinitialiser le mot de passe
DELETE /api/auth/delete - Supprimer le compte


Routes des tweets :

GET /api/tweets - Obtenir les tweets de la timeline
POST /api/tweets - Créer un tweet
DELETE /api/tweets/:id - Supprimer un tweet
POST /api/tweets/:id/comment - Commenter un tweet
GET /api/tweets/:id - Obtenir un tweet spécifique
POST /api/tweets/:id/like - Aimer un tweet
POST /api/tweets/:id/retweet - Retweeter


Routes des utilisateurs :

POST /api/users/signup - Inscrire un nouvel utilisateur
POST /api/users/:id/follow - Suivre un utilisateur
PUT /api/users/update - Mettre à jour le profil utilisateur



API GraphQL
L'API GraphQL fournit des requêtes et des mutations flexibles pour les tweets, les utilisateurs, les likes, les commentaires, et plus encore. Accédez à l'interface GraphQL Playground à l'adresse http://localhost:5000/graphql lors de l'exécution de l'application.

# Partie IA

# Module IA d'Analyse des Émotions - Extension du projet Tweeter

Cette partie du projet Tweeter intègre des fonctionnalités avancées d'intelligence artificielle pour l'analyse des émotions faciales. Développée avec TensorFlow et FastAPI pour le backend et Next.js pour le frontend, cette extension permet d'analyser les expressions du visage et de déterminer l'émotion dominante d'un utilisateur en temps réel.

## 🚀 Stack Technologique

### Backend IA
- **Python** - Langage de programmation
- **FastAPI** - Framework API performant
- **TensorFlow** - Bibliothèque d'apprentissage automatique
- **OpenCV & MTCNN** - Traitement d'images et détection faciale
- **Uvicorn** - Serveur ASGI pour FastAPI

### Frontend IA
- **Next.js** - Framework React
- **TailwindCSS** - Stylisation
- **Lucide React** - Icônes et composants visuels
- **Framer Motion** - Animations fluides

## 🔧 Structure du Projet


├── IA/                      # Module d'intelligence artificielle
│   ├── backend/             # API d'analyse des émotions
│   │   ├── EmotionDisplay.py  # Module de formatage des prédictions
│   │   ├── main.py          # Point d'entrée de l'API FastAPI
│   │   ├── requirements.txt # Dépendances Python
│   │   └── Dockerfile       # Configuration Docker
│   │
│   ├── frontend/            # Interface utilisateur pour l'analyse des émotions
│   │   ├── app/             # Application Next.js
│   │   │   ├── globals.css  # Styles globaux
│   │   │   ├── layout.js    # Layout principal
│   │   │   └── page.jsx     # Page principale
│   │   ├── components/      # Composants React
│   │   ├── utils/           # Utilitaires
│   │   └── Dockerfile       # Configuration Docker
│   │
│   └── predection_emotions.py # Script d'entraînement du modèle

## ✨ Fonctionnalités

- **Détection faciale en temps réel** - Analyse du visage via la webcam
- **Reconnaissance d'émotions** - Classification des expressions faciales en 7 émotions : joie, tristesse, colère, peur, dégoût, surprise et neutre
- **Visualisation des résultats** - Interface intuitive avec pourcentages de confiance
- **Conseils personnalisés** - Recommandations basées sur l'émotion détectée
- **Analyse en continu** - Capture automatique à intervalles réguliers
- **Historique des émotions** - Suivi de l'évolution émotionnelle

## 🛠️ Installation et Configuration

### Prérequis
- Docker et Docker Compose installés sur votre machine
- Python 3.9+ (pour le développement local du backend IA)
- Node.js (pour le développement local du frontend IA)

### Utilisation de Docker Compose

1. Assurez-vous que le fichier `docker-compose.yml` inclut les services `ai-backend` et `ai-frontend`

2. Démarrer les services d'IA avec Docker Compose
```bash
   docker-compose up -d ai-backend ai-frontend
```
3. Les services seront disponibles aux adresses suivantes :

Backend IA: http://localhost:8000
Frontend IA: http://localhost:3001

Configuration pour le Développement Local

 1. Installer les dépendances du backend IA

```bash
cd IA/backend
pip install -r requirements.txt
```

 2. Démarrer le serveur backend IA

```bash
cd IA/backend
python main.py
```
 3. Installer les dépendances du frontend IA

```bash
cd IA/frontend
npm install
```

 4. Démarrer l'application frontend IA

```bash
cd IA/frontend
npm run dev
```

📝 API de Reconnaissance d'Émotions
Points de Terminaison de l'API

• GET /emotions - Obtenir la liste des émotions reconnues par le modèle

```json
{
  "emotions": ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"],
  "count": 7
}
```

• GET /history - Obtenir l'historique des émotions détectées

```json
{
  "history": [
    {
      "prediction": "happy",
      "confidence": 0.92,
      "label_fr": "Joie",
      "timestamp": "2023-04-01T14:23:15.123Z"
    },
    ...
  ],
  "dominant_emotion": "happy"
}
```

• POST /predict/ - Analyser une image téléchargée

    Requête: Formulaire multipart avec un fichier image
    Réponse: Résultat de l'analyse avec l'émotion détectée


• POST /predict-base64/ - Analyser une image en base64

Requête:

```json
{
  "image": "data:image/jpeg;base64,..."
}
```

Réponse:

```json
{
  "prediction": "happy",
  "confidence": 0.92,
  "label_fr": "Joie",
  "description": "La joie est une émotion positive...",
  "tips": ["Savourez ce moment de bonheur", ...],
  "face_image": "data:image/jpeg;base64,..."
}
```


🧠 Modèle d'Apprentissage Automatique
Le système utilise un modèle de deep learning basé sur une architecture ResNet adaptée pour la reconnaissance des expressions faciales. Le modèle a été entraîné sur un dataset d'images en niveaux de gris de 48x48 pixels, optimisé pour classer les 7 émotions de base.
Le script predection_emotions.py contient le code utilisé pour entraîner le modèle, avec:

Architecture ResNet équilibrée - Couches convolutives avec connexions résiduelles
Focal Loss - Fonction de perte adaptée au déséquilibre des classes
Augmentation de données - Rotations, translations, zoom et ajustements de luminosité
Early Stopping - Arrêt anticipé pour éviter le surapprentissage

🔄 Intégration avec Tweeter
Le module d'analyse des émotions est conçu pour s'intégrer facilement à l'application principale Tweeter:

L'interface d'analyse des émotions est accessible via une URL dédiée: http://localhost:3001
L'API d'IA peut être interrogée indépendamment à l'adresse: http://localhost:8000

Les deux composants peuvent être déployés comme des microservices distincts, facilitant la mise à l'échelle et la maintenance indépendante.
🖥️ Captures d'écran
Dans une implémentation complète, vous pourriez inclure ici des captures d'écran montrant:

L'interface d'analyse en temps réel
Le tableau de bord des émotions
Les visualisations de l'historique des émotions