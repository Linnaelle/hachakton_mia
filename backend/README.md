# Rettewt Backend

## 📋 Description
Backend de Rettewt, une application de microblogging développée avec Node.js, Express, MongoDB et GraphQL.

## 🚀 Fonctionnalités

- **Authentification** : Inscription, connexion, déconnexion
- **Gestion des utilisateurs** : Profils, abonnements
- **Tweets** : Publication, likes, retweets, commentaires
- **Notifications** : En temps réel
- **Recherche** : Contenu, hashtags
- **Médias** : Upload d'images et vidéos

## 💻 Technologies Principales

- Node.js et Express
- MongoDB avec Mongoose
- GraphQL (Apollo Server)
- Redis
- Elasticsearch
- JWT
- Bcrypt
- Joi
- Nodemailer
- Multer

## 🏗 Architecture du Projet

- **Modèles** : Structure des données
- **Contrôleurs** : Logique métier
- **Routes** : Points d'entrée API
- **Resolvers GraphQL** : Résolution des requêtes
- **Services** : Fonctionnalités transversales
- **Middlewares** : Traitement des requêtes
- **Files d'attente** : Tâches asynchrones

## 📁 Structure des Fichiers

```
backend/
├── config/
│   ├── db.js               # Configuration MongoDB
│   ├── email.js            # Configuration emails
│   ├── jwtConfig.js        # Configuration JWT
│   └── redis.js            # Configuration Redis
├── controllers/
│   ├── adminController.js  # Contrôleur d'administration
│   ├── authController.js   # Contrôleur d'authentification
│   ├── emailController.js  # Contrôleur d'emails
│   ├── passwordController.js # Contrôleur de mot de passe
│   ├── tweetController.js  # Contrôleur de tweets
│   └── userController.js   # Contrôleur utilisateur
├── graphql/
│   ├── resolvers.js        # Résolveurs GraphQL
│   └── typeDefs.js         # Définitions de types GraphQL
├── middlewares/
│   ├── authMiddleware.js   # Middleware d'authentification
│   └── middleware.js       # Middlewares généraux
├── models/
│   ├── comments.js         # Modèle de commentaires
│   ├── hashtags.js         # Modèle de hashtags
│   ├── index.js            # Point d'entrée des modèles
│   ├── likes.js            # Modèle de likes
│   ├── tweets.js           # Modèle de tweets
│   └── users.js            # Modèle d'utilisateurs
├── queues/
│   ├── mediaQueue.js       # File d'attente pour médias
│   └── notificationQueue.js # File d'attente de notifications
├── routes/
│   ├── adminRoutes.js      # Routes d'administration
│   ├── authRoutes.js       # Routes d'authentification
│   ├── tweetsRoute.js      # Routes de tweets
│   └── usersRoute.js       # Routes utilisateur
├── services/
│   ├── emailService.js     # Service d'emails
│   ├── NotificationService.js # Service de notifications
│   └── tokenService.js     # Service de tokens
├── utils/
│   ├── auth.js             # Utilitaires d'authentification
│   ├── elasticsearchClient.js # Client Elasticsearch
│   ├── graphUpload.js      # Gestion des uploads GraphQL
│   ├── joiObjectId.js      # Validation d'ObjectId
│   └── uploads.js          # Configuration des uploads
├── app.js                  # Configuration principale de l'application
├── resolvers.js            # Resolvers GraphQL
├── typeDefs.js             # Définitions de types GraphQL
└── wsServer.js             # Serveur WebSocket
```

## ⚙️ Configuration

Variables d'environnement dans `.env` :

```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rettewt
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=1h
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_HOST=smtp.example.com
ELASTICSEARCH_URL=http://localhost:9200
```

## 🔧 Installation

1. Clonez le dépôt
```bash
git clone https://github.com/votre-repo/rettewt-backend.git
cd rettewt-backend
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env`

4. Démarrez les services
```bash
# MongoDB
mongod

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

### Authentification
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Tweets
- `GET /api/tweets`
- `POST /api/tweets`
- `DELETE /api/tweets/:id`
- `POST /api/tweets/:id/like`

### Utilisateurs
- `POST /api/users/signup`
- `PUT /api/users/update`

## 🔌 API GraphQL

### Requêtes Principales
```graphql
type Query {
  getTweet(id: ID!): Tweet
  getCurrentUser: User
  getTimeline: [Tweet]
}
```

### Mutations Principales
```graphql
type Mutation {
  createTweet(content: String!): Tweet
  likeTweet(tweetId: ID!): Tweet
  follow(userId: ID!): User
}
```

## 📊 Modèles de Données

### Utilisateur
```javascript
{
  username: String,
  email: String,
  password: String,
  profile_img: String,
  followers: [ObjectId],
  role: String
}
```

### Tweet
```javascript
{
  content: String,
  author: ObjectId,
  likes: [ObjectId],
  comments: [ObjectId],
  media: String
}
```

## 🔌 Services Principaux

### Token Service
- Génération des tokens JWT
- Vérification des tokens

### Email Service
- Envoi d'emails de vérification
- Réinitialisation de mot de passe

### Notification Service
- Gestion des notifications en temps réel
```