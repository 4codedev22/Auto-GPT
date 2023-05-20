#!/bin/bash
rm -rf autogpt_$1
mkdir autogpt_$1
cd autogpt_$1
pip install playwright --upgrade
playwright install
cd ..
./run.sh -C $1.yaml -w autogpt_$1 --install-plugin-deps