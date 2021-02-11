#!/bin/bash
source .env

docker run \
-v `pwd`/db/data:/var/lib/postgresql/data \
-v `pwd`/db/init.sh:/docker-entrypoint-initdb.d/init.sh \
-e POSTGRES_PASSWORD=${POSTGRES_ROOT_PW} \
-e BADGES_PASSWORD=${POSTGRES_BADGES_PW} \
-e EVENTS_PASSWORD=${POSTGRES_EVENTS_PW} \
-e ACCOUNTS_PASSWORD=${POSTGRES_ACCOUNTS_PW} \
-e PRESENTATIONS_PASSWORD=${POSTGRES_PRESENTATIONS_PW} \
-p 5432:5432 \
-d --rm --name postgres postgres

while ! docker logs postgres | grep ready; do
  sleep 3
done

cd accounts
npm run migrate -- up
cd ../badges
npm run migrate -- up
cd ../presentations
npm run migrate -- up
cd ../events
npm run migrate -- up

# docker kill postgres
