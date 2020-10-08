#!/bin/sh

set -euo pipefail

STACK_NAME=ccstar-ci

sam deploy \
        --stack-name $STACK_NAME \
        --template-file ci.yaml \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset