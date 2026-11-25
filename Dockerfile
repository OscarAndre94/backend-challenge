FROM node:24.17.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://postgres:password@localhost:5432/backend_challenge?schema=public" npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

