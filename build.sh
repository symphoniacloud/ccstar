#!/bin/sh

set -euo pipefail

# Package Lambda source code
# TODO - see if we can get sam build to do this nicely, e.g. with Makefile
PACKAGE_DIR=".temp-deploy-package"
TARGET_DIR="target"
LAMBDA_ZIP_FILE="prod-lambda.zip"

[ -d $PACKAGE_DIR ] && rm -rf $PACKAGE_DIR
[ -d $TARGET_DIR ] && rm -rf $TARGET_DIR
mkdir $PACKAGE_DIR
mkdir $TARGET_DIR
cd $PACKAGE_DIR
cp ../{package.json,package-lock.json} .
cp -rp ../src/* .
npm install --prod
rm package.json package-lock.json
zip ../$TARGET_DIR/$LAMBDA_ZIP_FILE -r *
cd ..
rm -rf $PACKAGE_DIR
echo
echo "Lambda zip file packaged at ./$TARGET_DIR/$LAMBDA_ZIP_FILE"
echo
