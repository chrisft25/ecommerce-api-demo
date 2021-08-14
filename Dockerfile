FROM node:14

WORKDIR /app
ARG DATABASE_URL=
ADD package.json package-lock.json ./
COPY . .

RUN npm install --silent
RUN npm i -g serverless --silent
CMD ["npm","run","dev"]
