#!/bin/sh

set -euo pipefail

if [ "$#" -gt 0 ]; then
  STACK_NAME=$1
else
  STACK_NAME="ccstar-${USER}"
fi

cfn-lint template.yaml

CLOUDFORMATION_ARTIFACTS_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name==\`CloudformationArtifactsBucket\`].Value" --output text)
if [ -z "$CLOUDFORMATION_ARTIFACTS_BUCKET" ]; then
  echo "Unable to locate Cloudformation Export 'CloudformationArtifactsBucket' - have you setup the account-wide-resources for this account and region?"
  exit 1
fi

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

echo "Deploying stack $STACK_NAME"
echo "Deploying using Cloudformation artifacts bucket $CLOUDFORMATION_ARTIFACTS_BUCKET"
echo

sam deploy \
        --stack-name "$STACK_NAME" \
        --s3-bucket "$CLOUDFORMATION_ARTIFACTS_BUCKET" \
        --template-file template.yaml \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset