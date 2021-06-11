FROM node:14-alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm install --only=production

COPY index.js .
COPY index.html .

EXPOSE 8080
CMD [ "node", "index.js" ]