FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

RUN npm ci

COPY . .

RUN npm run build

RUN chown -R appuser:appgroup /app

USER appuser

CMD ["npm", "run", "start:prod"]