#!/bin/bash

# My ryzen+RX7900 is faster than my strix halo. Update to your preferred host
HOST=${HOST:-ryzen}

# Adjust for GPU size
MAX_MODEL_SIZE="16"

# Use this to specify a custom lemonade binary
EXE=${EXE:-lemonade}

# There are a number of different tasks:
#	vision: describe the contents of an image
#	transcription: OCR/transcription of an image
TASK=${TASK:-vision}

# use this to restrict eligible models (using a custom "ocr" label, for example)
LABEL=${LABEL:-vision}

# Vulkan is faster on my machine, and this evaluation is about response
# quality, not speed. No point in comparing all backends
BACKENDS="--backend vulkan"

# Some models perform better with particular llama configuration, but not all support this
#LLAMA_ARGS="--llamacpp-args '--image-max-tokens 1120' --llamacpp-args '--image-min-tokens 1120' --llamacpp-args '--ubatch-size 2048'"

THISDIR=$(dirname $(realpath $BASH_ARGV0))

# Each task directory must contain "bench_scenarios.json"
SCENARIOS="--scenario-file ${THISDIR}/task_${TASK}/bench_scenarios.json"

# Because this is a quality evaluation, responses must be captured
RESP_LOGFILE="--response-log ${THISDIR}/${HOST}_${TASK}.ndjson"

# Fetch the list of models to test. Construction of jq filters is out of scope
MODELS=$(
	curl --silent http://${HOST}:13305/v1/models \
	| jq ".data[] | select(.recipe==\"llamacpp\") | select(.downloaded==true) | select(.size<=${MAX_MODEL_SIZE}) | select(.labels[]| IN(\"${LABEL}\")) | .id" \
	| sort -u \
	| xargs
	)

# Note that the regular output from `lemonade bench` is not captured since it's not really helpful
# Use this if you're just running a benchmark
                   $EXE --host ${HOST} bench $MODELS --runs 1 ${SCENARIOS} ${RESP_LOGFILE} ${BACKENDS} ${LLAMA_ARGS} --auto-pull

# Use this if you're debugging
# gdb -ex=r --args $EXE --host ${HOST} bench $MODELS --runs 1 ${SCENARIOS} ${RESP_LOGFILE} ${BACKENDS} ${LLAMA_ARGS} --auto-pull
