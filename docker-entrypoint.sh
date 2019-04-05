#!/bin/sh
set -e

if [ "${1#-}" != "$1" ] || [ "$1" = 'client' ] || [ "$1" = 'server' ] || [ "$1" = 'relay' ]; then
	set -- yarn "$@"
fi

exec "$@"
