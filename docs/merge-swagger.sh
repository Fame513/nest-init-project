#!/usr/bin/env bash

mkdir -p docs/swagger-out; rm -rf docs/swagger-out/spec.yaml; swagger-merger -i docs/spec/index.yaml -o docs/swagger-out/spec.yaml