#!/bin/bash
# create variable site with default value
site='https://www.aguiacontabilidadego.com.br'
rm -rf autogpt_diagnoses/data.json autogpt_diagnoses/questions.txt
mkdir -p autogpt_diagnoses
bash diagnoses-forms.sh diagnoses $site
./run.sh -C diagnoses.yaml -w autogpt_diagnoses --allow-downloads