#!/bin/bash
mkdir -p autogpt_diagnoses
python scrape_links.py $1 autogpt_diagnoses/hyperlinks.json
bash diagnoses-forms.sh diagnoses $1
python scrape_content.py autogpt_diagnoses/hyperlinks.json autogpt_diagnoses/data.json   autogpt_diagnoses/questions.txt
./run.sh -C diagnoses.yaml -w autogpt_diagnoses