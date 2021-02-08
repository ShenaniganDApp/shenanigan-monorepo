FROM node:14-alpine as base
WORKDIR /usr/src/app

# Install dependencies for dev and prod
COPY package.json .
COPY lerna.json .
COPY yarn.lock .
COPY packages/server/src/graphql/schema/schema.graphql ./packages/server/src/graphql/schema/
COPY tsconfig.base.json .
COPY packages/server/*.json ./packages/server/
COPY packages/utils/*.json ./packages/utils/

RUN apk update && \ 
    apk upgrade && \ 
    apk add git 

RUN yarn install --pure-lockfile

FROM base as build

COPY packages/server ./packages/server/
COPY packages/utils ./packages/utils/

# Build
RUN yarn server:build

CMD [ "yarn", "server", "serve" ]