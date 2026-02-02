#!/bin/sh


echo "Using backend hostname $VITE_BACKEND_HOSTNAME"
cd /sourceapp
npm run build

cp -r /sourceapp/dist/* /usr/share/nginx/html

echo "Starting nginx"
nginx