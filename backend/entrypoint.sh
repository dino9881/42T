#!/bin/sh

# set -e

# wait for the postgres container to be ready
# wait-for-it postgres:5432 -t 60 -- echo "postgres is up"
curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x wait-for-it.sh
./wait-for-it.sh postgres:5432 -- echo "PostgreSQL is up and running!"

export PRISMA_MIGRATE_INTERACTIVE=true

# generate the Prisma Client
npx prisma migrate dev --name init && \
# npx prisma migrate deploy && \
npx prisma generate

# npm run build

# start the NestJS application
# exec $@ 
npm run start