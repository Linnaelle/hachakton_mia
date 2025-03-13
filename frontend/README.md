# Rettewt Frontend

## 📋 Description
Interface utilisateur de Rettewt, développée avec Next.js, React et TypeScript.

## 🚀 Fonctionnalités

- **Authentification** : Connexion, inscription
- **Profil utilisateur** : Édition, affichage
- **Timeline** : Affichage des tweets
- **Interactions** : Likes, commentaires, retweets
- **Responsive design**
- **Navigation dynamique**

## 💻 Technologies Principales

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Apollo GraphQL
- React Query
- Heroicons

## 🏗 Architecture du Projet

- **Composants** : Éléments d'interface réutilisables
- **Contexte** : Gestion de l'état global
- **Hooks** : Logique réutilisable
- **Types** : Définitions TypeScript

## 📁 Structure des Fichiers

```
frontend/
└── app/
    ├── api/
    │   └── tweets/
    │       └── routes.js         # Routes de l'API tweets
    ├── components/
    │   ├── footer.tsx             # Composant de pied de page
    │   ├── header.tsx             # Composant d'en-tête
    │   ├── CommentsList.tsx       # Liste des commentaires
    │   ├── Feed.tsx               # Flux de tweets
    │   ├── Search.tsx             # Composant de recherche
    │   ├── Sidebar.tsx            # Barre latérale
    │   ├── SuggestedProfiles.tsx  # Profils suggérés
    │   ├── Tabs.tsx               # Composant d'onglets
    │   ├── Tweet.tsx              # Composant de tweet individuel
    │   ├── TweetList.tsx          # Liste de tweets
    │   └── TweetModal.tsx         # Modal de tweet
    ├── context/
    │   ├── ApolloProviderWrapper.tsx  # Wrapper Apollo
    │   ├── appContext.tsx         # Contexte global de l'application
    │   └── QueryClientProvider.tsx # Fournisseur React Query
    ├── editProfile/
    │   └── page.tsx               # Page d'édition de profil
    ├── forgot-password/
    │   └── page.tsx               # Page de mot de passe oublié
    ├── graphql/
    │   ├── mutations.ts           # Mutations GraphQL
    │   └── queries.ts             # Requêtes GraphQL
    ├── login/
    │   └── page.tsx               # Page de connexion
    ├── privacy/
    │   └── page.tsx               # Page de politique de confidentialité
    ├── profile/
    │   └── page.tsx               # Page de profil
    ├── reset-password/
    │   └── page.tsx               # Page de réinitialisation de mot de passe
    ├── signup/
    │   └── page.jsx               # Page d'inscription
    ├── type/
    │   ├── auth.ts                # Types d'authentification
    │   └── user.ts                # Types utilisateur
    └── autres fichiers et dossiers
```

## ⚙️ Configuration

Variables d'environnement dans `.env.local` :

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```

## 🔧 Installation

1. Clonez le dépôt
```bash
git clone https://github.com/votre-repo/rettewt-frontend.git
cd rettewt-frontend
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env.local`

4. Lancez le serveur de développement
```bash
npm run dev
```

## 🔌 Requêtes GraphQL

### Requêtes Principales
```graphql
query {
  getTimeline {
    id
    content
    author {
      username
    }
  }
}
```

### Mutations Principales
```graphql
mutation {
  createTweet(content: "Hello World!") {
    id
    content
  }
}
```

## 📊 Types Principaux

### Utilisateur
```typescript
interface User {
  id: string
  username: string
  email: string
  profile_img?: string
}
```

### Tweet
```typescript
interface Tweet {
  id: string
  content: string
  author: User
  likes: number
  comments: number
}
```

## 🎨 Composants Clés

### Layout
- Header
- Sidebar
- Feed
- Profile

### Authentification
- Formulaire de connexion
- Formulaire d'inscription
- Récupération de mot de passe

## 🚀 Interactions Principales

- Création de tweets
- Like et commentaire
- Navigation entre pages
- Mise à jour du profil
```