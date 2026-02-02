FROM node:latest AS build
RUN apt-get update && apt-get install -y nginx

COPY . /sourceapp
WORKDIR /sourceapp
RUN npm ci
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]