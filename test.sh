#!/usr/bin/env bash

file=${1:-cc.csv}

curl -X POST --data-binary "@$file" localhost:8080/money/upload
