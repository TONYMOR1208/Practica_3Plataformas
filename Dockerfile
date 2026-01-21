FROM node:25

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY index.js .
COPY users.json .

EXPOSE 3005

CMD ["node", "index.js"]
