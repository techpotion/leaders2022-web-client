### Build ###
FROM node:16.18-alpine3.16 AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm ci --loglevel=error

COPY . .
RUN npm run build

### Run ###
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/web-client /usr/share/nginx/html
