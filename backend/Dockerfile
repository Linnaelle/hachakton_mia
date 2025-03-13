FROM node:18

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Créer le dossier uploads s'il n'existe pas
RUN mkdir -p uploads

# Exposer les ports
EXPOSE 5000
EXPOSE 5001

CMD ["npm", "run", "dev"]