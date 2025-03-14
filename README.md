# Rettewt

Lien Trello:
https://trello.com/invite/b/67cecda2878b4d361fb04c3e/ATTI22631423a5b90829918e718ab7ada8ab6F2598BC/hackathon-g30

Application de microblogging fullstack inspirée de Twitter.

## 📋 Description
Rettewt est une plateforme de microblogging moderne, développée avec une stack technologique complète.

## 🚀 Fonctionnalités Principales

- **Authentification** complète
- **Publications** : Tweets, médias
- **Interactions sociales** 
  - Likes
  - Commentaires
  - Retweets
- **Profils utilisateurs**
- **Timeline personnalisée**
- **Recherche de contenu**

## 💻 Architecture Technique

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Apollo GraphQL

### Backend
- Node.js
- Express
- MongoDB
- GraphQL
- Redis
- Elasticsearch

## 🏗 Architecture du Projet

```
rettewt/
├── backend/     # Serveur Node.js
│   ├── config/
│   ├── controllers/
│   ├── graphql/
│   ├── middlewares/
│   ├── models/
│   ├── queues/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── resolvers.js
│   ├── typeDefs.js
│   └── wsServer.js
├── frontend/    # Interface utilisateur Next.js
│   └── app/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── editProfile/
│       ├── forgot-password/
│       ├── graphql/
│       ├── login/
│       ├── privacy/
│       ├── profile/
│       ├── reset-password/
│       ├── signup/
│       └── type/
├── docs/        # Documentation
└── IA/          # Ressources d'intelligence artificielle
```

## 🔧 Installation Globale

### Prérequis
- Node.js 18+
- MongoDB
- Redis
- Elasticsearch

### Étapes

1. Clonage du dépôt
```bash
git clone https://github.com/votre-repo/rettewt.git
cd rettewt
```

2. Installation des dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configuration
- Créer `.env` dans chaque sous-projet
- Définir les variables d'environnement

4. Lancement
```bash
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm run dev
```

## 🔌 Interfaces API

### API REST
- Points d'entrée pour authentification
- Opérations CRUD sur les ressources
- Gestion des utilisateurs et tweets

### API GraphQL
- Requêtes flexibles
- Mutations puissantes
- Typage fort

## 📊 Modèles de Données

### Utilisateur
- Profil utilisateur
- Authentification
- Statistiques sociales

### Tweet
- Contenu
- Interactions
- Médias
- Métadonnées

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe
- Validation des données
- Protection contre les attaques

## 🌐 Déploiement

- Docker
- lancement
```bash
docker-compose up -d --build
```
- Arrret
```bash
docker-compose down
```
