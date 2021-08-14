FROM node:14

WORKDIR /app
ADD package.json package-lock.json ./
ADD . .

RUN npm install --silent
RUN npm i -g serverless --silent
ENTRYPOINT [ "npm","run","docker" ]
