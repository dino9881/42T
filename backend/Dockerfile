FROM node:14.17

WORKDIR /app

COPY . .

# RUN apt-get update && apt-get install -y wait-for-it
# RUN set -eux

RUN npm install

# COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "sh", "-c", "./entrypoint.sh" ]

EXPOSE 5001

# CMD ["npm", "run", "start:dev"]
# CMD ["npm", "run", "start"]