#!/usr/bin/env sh

export SERVING_PORT=${PORT:-80}
echo "Serving on port: ${SERVING_PORT}"
envsubst '${SERVING_PORT}' < ./default.tmpl.conf > /etc/nginx/conf.d/default.conf

cat /etc/nginx/conf.d/default.conf
exec /docker-entrypoint.sh nginx -g 'daemon off;'

