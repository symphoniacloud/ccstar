#!/bin/sh

if [ -z "$VERSION" ]; then
  echo "VERSION env var not set - exiting"
  exit 1
fi

set -euo pipefail

cfn-lint template.yaml

CLOUDFORMATION_ARTIFACTS_BUCKET=$(aws cloudformation --region us-east-1 list-exports --query "Exports[?Name==\`CloudformationArtifactsBucket\`].Value" --output text)
if [ -z "$CLOUDFORMATION_ARTIFACTS_BUCKET" ]; then
  echo "Unable to locate Cloudformation Export 'CloudformationArtifactsBucket' - have you setup the account-wide-resources for this account and region?"
  exit 1
fi

./build.sh

sam package \
    --region us-east-1 \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket "$CLOUDFORMATION_ARTIFACTS_BUCKET"

sam publish \
    --region us-east-1 \
    --semantic-version "$VERSION" \
    --template packaged.yaml