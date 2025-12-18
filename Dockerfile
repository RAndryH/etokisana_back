# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer toutes les dépendances (dev incluses pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Build TypeScript
RUN npm run build

# Copier les fichiers non-TypeScript
RUN mkdir -p built/Utils/Emails/Template && \
    cp -r src/Utils/Emails/Template/* built/Utils/Emails/Template/

# Production image
FROM node:18-alpine

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer seulement les dépendances de production
RUN npm ci --only=production

# Copier le build
COPY --from=builder /app/built ./built

# Vérifier que les fichiers sont là
RUN ls -la built/ && \
    ls -la built/Utils/Emails/Template/

# Exposer le port Koyeb
EXPOSE 8000

# Commande de démarrage
CMD ["node", "built/server.js"]