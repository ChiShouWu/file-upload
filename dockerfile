FROM node:18-alpine as builder


WORKDIR "/app"

COPY package*.json ./

RUN npm prune
RUN npm ci

COPY  . .

RUN npm run build

FROM node:18-alpine as runner

ENV NODE_ENV=production

WORKDIR "/app"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

CMD ["node", "dist/main.js"]