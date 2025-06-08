# --- Etapa 1: Dependencias Base ---
FROM node:20-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de manifiesto para aprovechar el cache de Docker
COPY package.json package-lock.json ./

# Instala las dependencias de desarrollo y producción
RUN npm ci

# --- Etapa 2: Build de Next.js ---
FROM base AS builder

WORKDIR /app

# Copia todo el código fuente del proyecto Next.js
COPY . .

# Genera el build de producción de Next.js
RUN npm run build

# --- Etapa 3: Runner de Producción ---
FROM node:20-alpine AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Configura variables de entorno para Next.js en producción
ENV NODE_ENV=production

# Copia las dependencias de producción de la etapa 'base'
COPY --from=base /app/node_modules ./node_modules

# Copia los archivos de Next.js generados en la etapa 'builder'
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expone el puerto por defecto de Next.js (3000)
EXPOSE 3000

# Comando para iniciar la aplicación Next.js en modo producción
CMD ["npm", "start"]
