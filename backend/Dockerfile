FROM node:18-alpine

WORKDIR /app

COPY package.json /app
# COPY package-lock.json /app

# RUN rm -rf node_modules
RUN npm install
# RUN npm rebuild better-sqlite3

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]