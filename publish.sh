#!/bin/sh

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

echo "Would be publishing $VERSION"

#sam publish \
#    --region us-east-1 \
#    --semantic-version 0.0.2 \
#    --template packaged.yaml