import json
import os

file_lists_path = './file_lists.json'
code_path = ''
# Read file_lists.json and move it to file_lists.json.bkp
with open(file_lists_path, 'r') as f:
    json_files = json.load(f)

# Check if json_files list is empty
if not json_files:
    print('')
else:
    while not code_path and json_files:
        item = json_files[0]
        with open(item, 'r') as f:
            code_paths = json.load(f)
            # If code_paths is empty list, remove item from json_files
            if not code_paths:
                json_files.pop(0)
                with open(file_lists_path, 'w') as f:
                    json.dump(json_files, f)
                
            # If code_paths is not empty, return first code_path and update file
            else:
                code_path = code_paths[0]
                code_paths.pop(0)
                with open(item, 'w') as f:
                    json.dump(code_paths, f)
                print(code_path)