FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002 50051

ENV NODE_ENV=production

CMD ["sh", "-c", "chmod +x node_modules/.bin/concurrently && npm start"]

