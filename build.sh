#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git push --set-upstream https://github.com/ITCS-4122-5122-PRJ-Team-3/demo.git HEAD:main -f

cd -
