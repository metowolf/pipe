FROM node:alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock .yarnclean docker-entrypoint.sh ./
RUN yarn install && yarn cache clean
COPY src ./src

CMD ["yarn server"]
ENTRYPOINT ["/app/docker-entrypoint.sh"]
