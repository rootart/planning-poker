FROM node:10.16.3-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.1 -g --silent

EXPOSE 3000

CMD ["npm", "start"]
