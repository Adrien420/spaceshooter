# Étape 1 : Copier les fichiers du frontend dans le conteneur Nginx
FROM nginx:latest

# Créez des répertoires pour les fichiers JavaScript, CSS et images dans le conteneur Nginx
RUN mkdir -p /usr/share/nginx/html/script
RUN mkdir -p /usr/share/nginx/html/style
RUN mkdir -p /usr/share/nginx/html/images

# Copiez les fichiers JavaScript du frontend dans le répertoire approprié du conteneur Nginx
COPY frontend/script/ /usr/share/nginx/html/script

# Copiez les fichiers CSS du frontend dans le répertoire approprié du conteneur Nginx
COPY frontend/style/ /usr/share/nginx/html/css

# Copiez le fichier HTML du frontend dans le répertoire approprié du conteneur Nginx
COPY frontend/index.html /usr/share/nginx/html

# Copiez le fichier CNAME du frontend dans le répertoire approprié du conteneur Nginx
COPY frontend/CNAME /usr/share/nginx/html

# Copiez les images du frontend dans le répertoire approprié du conteneur Nginx
COPY frontend/images/ /usr/share/nginx/html/images

# Exposez le port 80 pour le serveur Nginx
EXPOSE 80

# Utilisez les secrets dans votre application JavaScript
ENV API_KEY=$API_KEY
# Ajoutez d'autres secrets ici si nécessaire
