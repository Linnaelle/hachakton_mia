FROM node:18

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]