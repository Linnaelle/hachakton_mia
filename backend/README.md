# Rettewt App

Une application de microblogging inspirée de Twitter, développée avec Node.js, Express, MongoDB et GraphQL.

## 📋 Table des matières

- [Rettewt App](#rettewt-app)
  - [📋 Table des matières](#-table-des-matières)
  - [🚀 Fonctionnalités](#-fonctionnalités)
  - [💻 Technologies utilisées](#-technologies-utilisées)
  - [🏗 Architecture du projet](#-architecture-du-projet)
  - [📁 Structure des fichiers](#-structure-des-fichiers)
  - [⚙️ Configuration](#️-configuration)
  - [🔧 Installation](#-installation)
  - [📡 API REST](#-api-rest)
    - [Authentification](#authentification)
    - [Tweets](#tweets)
    - [Utilisateurs](#utilisateurs)
    - [Administration](#administration)
  - [🔌 API GraphQL](#-api-graphql)
    - [Requêtes](#requêtes)
    - [Mutations](#mutations)
    - [Types principaux](#types-principaux)
  - [📊 Modèles de données](#-modèles-de-données)
    - [User](#user)
    - [Tweet](#tweet)
    - [Comment](#comment)
    - [Like](#like)
    - [Hashtag](#hashtag)
  - [🔌 Services](#-services)
    - [Token Service](#token-service)
    - [Email Service](#email-service)
    - [Notification Service](#notification-service)
  - [📥 Files d'attente](#-files-dattente)
    - [Media Queue](#media-queue)
    - [Notification Queue](#notification-queue)
  - [🔄 WebSockets](#-websockets)
  - [🗄️ Mise en cache](#️-mise-en-cache)
  - [🔍 Recherche](#-recherche)
  - [🔒 Sécurité](#-sécurité)
  - [📁 Gestion des médias](#-gestion-des-médias)

## 🚀 Fonctionnalités

- **Authentification** : Inscription, connexion, déconnexion, vérification d'email, récupération de mot de passe
- **Tweets** : Publication, suppression, likes, retweets, commentaires
- **Utilisateurs** : Profils, abonnements, favoris, timeline personnalisée
- **Notifications** : Notifications en temps réel pour les likes, retweets, commentaires et nouveaux abonnés
- **Recherche** : Recherche de tweets par contenu
- **Hashtags** : Support des hashtags dans les tweets avec tendances
- **Médias** : Téléchargement et affichage d'images et vidéos
- **Interface** : API REST et GraphQL

## 💻 Technologies utilisées

- **Backend** :
  - Node.js et Express
  - MongoDB avec Mongoose
  - GraphQL avec Apollo Server
  - Redis pour la mise en cache
  - Elasticsearch pour la recherche
  - Bull pour les files d'attente
  - WebSockets pour les communications en temps réel
  - JWT pour l'authentification
  - Joi pour la validation des données
  - Bcryptjs pour le hashage des mots de passe
  - Nodemailer pour l'envoi d'emails
  - Multer pour la gestion des uploads

## 🏗 Architecture du projet

L'application est construite selon une architecture MVC (Modèle-Vue-Contrôleur) avec une couche de services :

- **Modèles** : Définissent la structure des données et les validations
- **Contrôleurs** : Gèrent la logique métier et les requêtes HTTP
- **Routes** : Définissent les points d'entrée de l'API REST
- **Resolvers GraphQL** : Implémentent la logique pour résoudre les requêtes GraphQL
- **Services** : Encapsulent des fonctionnalités transversales (tokens, emails, notifications)
- **Middlewares** : Traitent les requêtes avant qu'elles n'atteignent les contrôleurs
- **Files d'attente** : Traitent les tâches asynchrones (notifications, traitement des médias)
- **WebSockets** : Gèrent les communications en temps réel

## 📁 Structure des fichiers

```
rettewt/
├── config/                 # Configuration des services externes
│   ├── db.js               # Configuration de MongoDB
│   ├── email.js            # Configuration de Nodemailer
│   ├── jwtConfig.js        # Configuration JWT
│   └── redis.js            # Configuration Redis
├── controllers/            # Contrôleurs de l'API REST
│   ├── adminController.js  # Fonctionnalités d'administration
│   ├── authController.js   # Authentification
│   ├── emailController.js  # Gestion des emails
│   ├── passwordController.js # Gestion des mots de passe
│   ├── tweetController.js  # Gestion des tweets
│   └── userController.js   # Gestion des utilisateurs
├── middlewares/            # Middlewares Express
│   ├── authMiddleware.js   # Authentification JWT
│   └── middleware.js       # Configuration multer et autres middlewares
├── models/                 # Modèles Mongoose
│   ├── comments.js         # Commentaires
│   ├── hashtags.js         # Hashtags
│   ├── index.js            # Point d'entrée des modèles
│   ├── likes.js            # Likes
│   ├── tweets.js           # Tweets
│   └── users.js            # Utilisateurs
├── queues/                 # Files d'attente Bull
│   ├── mediaQueue.js       # Traitement des médias
│   └── notificationQueue.js # Notifications
├── routes/                 # Routes Express
│   ├── adminRoutes.js      # Routes d'administration
│   ├── authRoutes.js       # Routes d'authentification
│   ├── tweetsRoute.js      # Routes des tweets
│   └── usersRoute.js       # Routes des utilisateurs
├── services/               # Services réutilisables
│   ├── emailService.js     # Envoi d'emails
│   ├── NotificationService.js # Gestion des notifications
│   └── tokenService.js     # Gestion des tokens JWT
├── utils/                  # Utilitaires
│   ├── auth.js             # Utilitaires d'authentification GraphQL
│   ├── elasticsearchClient.js # Client Elasticsearch
│   ├── graphUpload.js      # Gestion des uploads GraphQL
│   ├── joiObjectId.js      # Validation des ObjectId avec Joi
│   └── uploads.js          # Configuration des uploads de fichiers
├── app.js                  # Configuration Express
├── resolvers.js            # Resolvers GraphQL
├── typeDefs.js             # Définitions des types GraphQL
└── wsServer.js             # Serveur WebSocket
```

## ⚙️ Configuration

La configuration de l'application se fait via des variables d'environnement dans un fichier `.env` :

```
# Serveur
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/rettewt

# JWT
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre_email@example.com
EMAIL_PASSWORD=votre_mot_de_passe
EMAIL_FROM=noreply@rettewt.com

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
```

## 🔧 Installation

1. Clonez le dépôt
   ```bash
   git clone https://github.com/Linnaelle/hachakton_mia.git
   cd rettewt
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à partir du modèle ci-dessus

4. Démarrez les services requis
   ```bash
   # MongoDB
   mongod --dbpath /path/to/data
   
   # Redis
   redis-server
   
   # Elasticsearch
   elasticsearch
   ```

5. Lancez l'application
   ```bash
   npm start
   ```

## 📡 API REST

L'API REST est accessible via le préfixe `/api` et comprend les points d'entrée suivants :

### Authentification

- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `POST /api/auth/logout` : Déconnexion
- `GET /api/auth/me` : Informations de l'utilisateur connecté
- `POST /api/auth/refresh-token` : Rafraîchir le token d'accès
- `GET /api/auth/verify-email/:token` : Vérifier l'email
- `POST /api/auth/resend-verification-email` : Renvoyer l'email de vérification
- `POST /api/auth/forgot-password` : Demander la réinitialisation du mot de passe
- `POST /api/auth/reset-password` : Réinitialiser le mot de passe
- `DELETE /api/auth/delete` : Supprimer le compte

### Tweets

- `GET /api/tweets` : Récupérer la timeline personnalisée
- `POST /api/tweets` : Créer un tweet
- `GET /api/tweets/:id` : Récupérer un tweet
- `DELETE /api/tweets/:id` : Supprimer un tweet
- `POST /api/tweets/:id/like` : Liker/unliker un tweet
- `POST /api/tweets/:id/retweet` : Retweeter/annuler un retweet
- `POST /api/tweets/:id/comment` : Commenter un tweet
- `GET /api/tweets/all` : Récupérer tous les tweets

### Utilisateurs

- `POST /api/users/signup` : Inscription
- `POST /api/users/:id/follow` : Suivre/ne plus suivre un utilisateur
- `PUT /api/users/update` : Mettre à jour le profil
- `GET /api/users/me` : Informations de l'utilisateur connecté

### Administration

- `GET /api/admin/users` : Récupérer tous les utilisateurs
- `PUT /api/admin/users/role` : Mettre à jour le rôle d'un utilisateur
- `DELETE /api/admin/users/:userId` : Supprimer un utilisateur

## 🔌 API GraphQL

L'API GraphQL est accessible à `/graphql` et offre :

### Requêtes

```graphql
type Query {
  # Récupère un tweet par son ID
  getTweet(id: ID!): TweetResponse
  
  # Recherche des tweets par contenu
  searchTweets(query: String!): [Tweet]
  
  # Récupère l'utilisateur authentifié
  getCurrentUser: User
  
  # Récupère le fil d'activité d'un utilisateur
  userTimeline: userTimeline!
  
  # Récupère le fil d'actualité personnalisé
  getTimeline: [TimelineResponse!]!
  
  # Récupère les tweets d'un utilisateur spécifique
  getUserTweets(userId: ID!): [Tweet!]!
}
```

### Mutations

```graphql
type Mutation {
  # Suivre/ne plus suivre un utilisateur
  follow(userId: ID!): FollowResponse!
  
  # Liker/unliker un tweet
  likeTweet(tweetId: ID!): LikeResponse
  
  # Créer un nouveau tweet
  createTweet(
    content: String!
    media: Upload
    mentions: [ID]
    hashtags: [String]
  ): Tweet!
  
  # Inscrire un nouvel utilisateur
  register(
    username: String!,
    email: String!,
    password: String!
  ): User
  
  # Retweeter/annuler un retweet
  reTweet(tweetId: ID!): RetweetResponse
  
  # Ajouter/retirer un tweet des favoris
  bookmarkTweet(tweetId: ID!): User
  
  # Connecter un utilisateur
  login(email: String!, password: String!): User
  
  # Déconnecter un utilisateur
  logout: LogoutResponse!
}
```

### Types principaux

```graphql
# Type pour les tweets
type Tweet {
  id: ID!
  content: String!
  media: String
  author: User!
  mentions: [User]
  likes: [User]
  comments: [Comment]
  isRetweet: Boolean
  retweets: [Tweet]
  hashtags: [String]
  createdAt: String!
}

# Type pour les utilisateurs
type User {
  id: ID!
  username: String!
  handle: String!
  email: String!
  token: String
  tweets: [Tweet]
  bio: String
  profile_img: String
  banniere_img: String
  followers: String
}

# Type pour les commentaires
type Comment {
  id: ID!
  content: String!
  author: User!
  tweetId: ID!
}
```

## 📊 Modèles de données

### User

```javascript
{
  username: String,
  handle: String,
  email: String,
  password: String,
  bio: String,
  profile_img: String, 
  banniere_img: String,
  followers: [ObjectId],
  followings: [ObjectId],
  bookmarks: [ObjectId],
  role: String, // 'user', 'admin', 'debile'
  isEmailVerified: Boolean,
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Tweet

```javascript
{
  content: String,
  media: String,
  author: ObjectId,
  originalTweet: ObjectId,
  isRetweet: Boolean,
  likes: [ObjectId],
  comments: [ObjectId],
  retweets: [ObjectId],
  mentions: [ObjectId],
  hashtags: [String]
}
```

### Comment

```javascript
{
  content: String,
  author: ObjectId,
  tweet: ObjectId
}
```

### Like

```javascript
{
  user: ObjectId,
  tweet: ObjectId
}
```

### Hashtag

```javascript
{
  tag: String,
  tweetCount: Number,
  lastUsedAt: Date
}
```

## 🔌 Services

### Token Service

Gère les tokens JWT pour l'authentification :
- Génération des tokens d'accès et de rafraîchissement
- Vérification des tokens
- Liste noire de tokens révoqués
- Rafraîchissement des tokens

### Email Service

Gère l'envoi d'emails :
- Génération de tokens de vérification/réinitialisation
- Envoi d'emails de vérification de compte
- Envoi d'emails de réinitialisation de mot de passe

### Notification Service

Gère les notifications utilisateur :
- Stockage des notifications dans Redis
- Récupération des notifications par utilisateur
- Suppression des notifications

## 📥 Files d'attente

L'application utilise Bull pour gérer les tâches asynchrones :

### Media Queue

Traite les médias téléchargés :
- Compression d'images
- Traitement de vidéos

### Notification Queue

Gère l'envoi des notifications :
- Stockage des notifications
- Envoi via WebSockets

## 🔄 WebSockets

Les WebSockets sont utilisés pour les communications en temps réel :
- Notifications instantanées pour les likes, comments, retweets et nouveaux abonnés
- Mises à jour du fil d'actualité
- Communication entre les clients connectés

## 🗄️ Mise en cache

Redis est utilisé pour la mise en cache :
- Timeline des utilisateurs
- Résultats de recherche
- Tweets individuels
- Notifications
- Liste noire de tokens JWT

## 🔍 Recherche

Elasticsearch est utilisé pour la recherche de tweets :
- Recherche par contenu
- Recherche par hashtag
- Optimisation des requêtes de recherche

## 🔒 Sécurité

L'application implémente plusieurs mesures de sécurité :
- Hachage des mots de passe avec bcrypt
- Authentification JWT
- Validation des données avec Joi
- Vérification d'email
- Liste noire de tokens
- Middlewares d'autorisation
- Expiration des tokens d'accès et de rafraîchissement

## 📁 Gestion des médias

Les médias sont gérés via Multer :
- Téléchargement d'images et vidéos
- Filtrage par types MIME
- Limite de taille de fichier
- Traitement asynchrone via Bull
- Support pour les uploads via API REST et GraphQL

---

Ce projet est développé à des fins éducatives et de démonstration.