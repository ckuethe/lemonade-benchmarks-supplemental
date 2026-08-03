#!/bin/bash

# Select models matching some criteria for running a side-by-side comparison

 SRV='http://localhost:13305/v1/models'
 REC="llamacpp"
 SIZE="16"

# can filter on labels in "ocr"
 curl --silent ${SRV} \
	| jq ".data[] | select(.recipe==\"${REC}\") | select(.downloaded==true) | select(.size<=${SIZE}) | select(.labels[]| IN(\"vision\")) | .id" \
	| sort -u \
	| grep -iv ocr \
	| xargs
