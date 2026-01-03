FROM node:latest AS build

COPY . /sourceapp
WORKDIR /sourceapp
ARG VITE_BACKEND_HOSTNAME
RUN echo VITE_BACKEND_HOSTNAME=$VITE_BACKEND_HOSTNAME > .env
RUN npm ci && npm run build

FROM nginx:latest
COPY --from=build /sourceapp/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
