import json
import requests
from read_file import read_file
from append_to_file import append_to_file
urls = json.loads(read_file('hyperlinks.json'))

for url in urls:
    response = requests.get(url)
    text = response.text
    append_to_file('data-content.txt', text)
