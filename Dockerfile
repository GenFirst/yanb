FROM node:6.2.1-slim

MAINTAINER ivanvs

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /src
WORKDIR /src

RUN npm install gulp -g

ADD package.json /src/package.json
RUN npm install

EXPOSE 3000
EXPOSE 35729

CMD ["npm", "start"]
