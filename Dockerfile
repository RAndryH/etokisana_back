# Dockerfile simplifié
FROM node:22-alpine

WORKDIR /app

# 1. Copier package.json
COPY package*.json ./

# 2. Installer dépendances
RUN npm ci

# 3. Copier tout le code
COPY . .

# 4. Build et copier templates en une étape
RUN npm run build && \
    mkdir -p built/Utils/Emails/Template && \
    cp -r src/Utils/Emails/Template/* built/Utils/Emails/Template/ && \
    echo "✅ Templates copiés:" && \
    ls -la built/Utils/Emails/Template/

# 5. Vérification finale
RUN echo "🔍 Structure finale:" && \
    find built -type f -name "*.handlebars" && \
    [ -f "built/Utils/Emails/Template/ValidationEmail.handlebars" ] && \
    echo "🎉 Template principal trouvé avec succès!" || echo "⚠️ Template non trouvé"

# 6. Port et commande
EXPOSE 8000

CMD ["node", "built/server.js"]