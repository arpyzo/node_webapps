#!/usr/bin/env bash

file=${1:-file1}

#curl -F "data=@$file" localhost:8888/upload
#curl -F 'data=@file1' -F 'data=@file2' localhost:8888/upload

#curl -X POST -F "param1=value1" -F "param2=value2" localhost:8888/upload
#curl -X POST -H 'Content-Type: application/json' -d '{"param1":"value1","param2":"value2"}' localhost:8888/upload
#curl -X POST -d "@$file" localhost:8888/upload
#curl -X POST -d "$(base64 $file)" localhost:8888/upload
curl -X POST -d "@$file.b64" localhost:8888/upload
