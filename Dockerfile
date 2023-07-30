# Étape 1 : Construire le frontend
FROM node:latest as builder

WORKDIR /app

# Copiez le code du frontend dans le conteneur
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/ ./

# Installez les dépendances du frontend
RUN npm install

# Construisez le frontend (par exemple, si vous utilisez Webpack, Angular CLI, ou autre)
RUN npm run build

# Étape 2 : Servez le frontend avec Nginx
FROM nginx:latest

# Copiez les fichiers du frontend construits dans le conteneur Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Exposez le port 80 pour le serveur Nginx
EXPOSE 80

# Utilisez les secrets dans votre application JavaScript
ENV API_KEY=$API_KEY
# Ajoutez d'autres secrets ici si nécessaire
