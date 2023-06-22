#!/usr/bin/env bash
#
# This script assumes a linux environment

echo "Building..."

npm run build

mkdir dist

cp -R plugin dist/wakatime-adobe

cd dist

zip -r ./wakatime-adobe *

cd ..
