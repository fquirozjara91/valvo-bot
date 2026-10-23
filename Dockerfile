FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY bot.js ./
COPY src ./src
COPY scripts ./scripts
COPY data/valheim-facts.json ./data/valheim-facts.json
COPY images ./images

CMD ["node", "bot.js"]
