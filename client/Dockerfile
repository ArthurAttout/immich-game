FROM node:latest AS build

COPY . /sourceapp
WORKDIR /sourceapp
RUN npm ci && npm run build

FROM nginx:latest
COPY --from=build /sourceapp/dist /usr/share/nginx/html