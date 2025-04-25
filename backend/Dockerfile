FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.ts"]
