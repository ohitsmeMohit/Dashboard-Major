FROM node:21-alpine AS SERVERAPP

ENV PORT=3000

WORKDIR /app

COPY package.json .
RUN npm install bcrypt
# RUN apk add –no-cache make gcc g++ python && \
# npm install && \
# npm rebuild bcrypt –build-from-source && \
# apk del make gcc g++ python
RUN npm install --verbose

COPY . .

EXPOSE 3000

CMD ["npm", "start"]