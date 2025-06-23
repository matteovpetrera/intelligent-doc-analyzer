# Base immagine Node.js per ARM64 (compatibile con Mac M1/M2/M3)
FROM --platform=linux/arm64 node:20-alpine

# Imposta la working directory
WORKDIR /app

# Copia i file necessari
COPY app/package.json app/package-lock.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del progetto
COPY . .

# Costruisci il progetto Next.js (solo se stai facendo una build di produzione)
# RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Avvia il server Next.js in modalità sviluppo (oppure usa 'start' se è produzione)
CMD ["npm", "run", "dev"]
