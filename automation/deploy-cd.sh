#!/bin/sh

set -euo pipefail

STACK_NAME=ccstar-cd

cfn-lint cd.yaml

CLOUDFORMATION_ARTIFACTS_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name==\`CloudformationArtifactsBucket\`].Value" --output text)
if [ -z "$CLOUDFORMATION_ARTIFACTS_BUCKET" ]; then
  echo "Unable to locate Cloudformation Export 'CloudformationArtifactsBucket' - have you setup the account-wide-resources for this account and region?"
  exit 1
fi

sam deploy \
        --stack-name $STACK_NAME \
        --template-file cd.yaml \
        --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
        --parameter-overrides CloudFormationArtifactsBucket="$CLOUDFORMATION_ARTIFACTS_BUCKET" \
        --no-fail-on-empty-changeset