#!/bin/bash

pushd $(dirname "$0")
export NODE_ENV=production
exec node ./bin/www
popd
