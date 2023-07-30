# Étape 1 : Copier les fichiers du frontend dans le conteneur Nginx
FROM nginx:latest

# Copiez les fichiers JavaScript du frontend dans le conteneur Nginx
COPY frontend/ /usr/share/nginx/html

# Exposez le port 80 pour le serveur Nginx
EXPOSE 80

# Utilisez les secrets dans votre application JavaScript
ENV API_KEY=$API_KEY
# Ajoutez d'autres secrets ici si nécessaire
