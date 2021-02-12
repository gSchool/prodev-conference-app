#!/bin/sh
set -e

for count in {1..10}; do
    if  $(nc -z ${PGHOST} ${PGPORT}) ; then
        echo "Can't connect to database"
        break
    fi
    sleep 3
done

npm run migrate -- up

exec "$@"