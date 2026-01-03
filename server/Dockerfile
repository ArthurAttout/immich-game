FROM node:25

COPY . /


RUN npm install -g typescript && npm ci
RUN tsc
ENTRYPOINT ["node","dist/app.js"]