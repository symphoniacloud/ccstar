#!/bin/sh

set -euo pipefail

if [ "$#" -gt 0 ]; then
  STACK_NAME=$1
else
  STACK_NAME="ccstar-${USER}"
fi

if [ "$#" -gt 1 ]; then
  BASIC_AUTH_TYPE=$2
else
  BASIC_AUTH_TYPE=None
fi

if [ "$#" -gt 2 ]; then
  BASIC_AUTH_CONFIG=$3
else
  BASIC_AUTH_CONFIG=None
fi

cfn-lint template.yaml

CLOUDFORMATION_ARTIFACTS_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name==\`CloudformationArtifactsBucket\`].Value" --output text)
if [ -z "$CLOUDFORMATION_ARTIFACTS_BUCKET" ]; then
  echo "Unable to locate Cloudformation Export 'CloudformationArtifactsBucket' - have you setup the account-wide-resources for this account and region?"
  exit 1
fi

./build.sh

echo "Deploying stack $STACK_NAME"
echo "Deploying using Cloudformation artifacts bucket $CLOUDFORMATION_ARTIFACTS_BUCKET"
echo

sam deploy \
        --stack-name "$STACK_NAME" \
        --s3-bucket "$CLOUDFORMATION_ARTIFACTS_BUCKET" \
        --template-file template.yaml \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides APILocalCacheTTL=0 BasicAuthType=${BASIC_AUTH_TYPE} BasicAuthConfig=${BASIC_AUTH_CONFIG} \
        --no-fail-on-empty-changeset
