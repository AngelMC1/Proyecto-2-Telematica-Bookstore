FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5003 50053

CMD ["sh", "-c", "chmod +x node_modules/.bin/concurrently && npm start"]
