#read a json file called list_files.json
import json
import os

def read_json():
    with open('./list_files.json') as json_file:
        data = json.load(json_file)
        return data
    

print(read_json())