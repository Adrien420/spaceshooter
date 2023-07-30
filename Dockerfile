# Étape 1 : Construire le frontend
FROM node:latest as builder

WORKDIR /app

# Copiez le code du frontend dans le conteneur
COPY frontend/ ./

# Étape 2 : Servez le frontend avec Nginx
FROM nginx:latest

# Copiez les fichiers du frontend construits dans le conteneur Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Exposez le port 80 pour le serveur Nginx
EXPOSE 80

# Utilisez les secrets dans votre application JavaScript
ENV API_KEY=$API_KEY
# Ajoutez d'autres secrets ici si nécessaire
