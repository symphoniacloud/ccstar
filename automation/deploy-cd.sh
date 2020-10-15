#!/bin/sh

set -euo pipefail

STACK_NAME=ccstar-cd

cfn-lint cd.yaml

sam deploy \
        --stack-name $STACK_NAME \
        --template-file cd.yaml \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset