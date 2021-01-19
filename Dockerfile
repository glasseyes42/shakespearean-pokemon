FROM node:14

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm --quiet ci

COPY . .

CMD ["node", "."]

EXPOSE 4567
