#!/bin/sh

set -e

VERSION=`cat package.json | grep 'version' | awk -F '"' '{print $4}'`

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t metowolf/pipe .

docker images

docker push metowolf/pipe
docker tag metowolf/pipe metowolf/pipe:$VERSION
docker push metowolf/pipe:$VERSION
