import json
import os
import sys
def get_directory_from_arg():
    # Get the first argument from the command line
    arg = sys.argv[1] if len(sys.argv) > 1 else ''
    return arg
def list_files(directory):
    # get all file paths in directory recursively by walking the directory tree
    files = []
    for (dirpath, dirnames, filenames) in os.walk(directory):
        for filename in filenames:
            files.append(os.path.join(dirpath, filename))        
    return files

def save_file_list_as_json(files, file_lists_path):
    # Save files as json
    with open(file_lists_path, 'w') as f:
        json.dump(files, f)

def load_file_list_from_json(file_lists_path):
    # Load files from json
    with open(file_lists_path, 'r') as f:
        files = json.load(f)
    return files

def get_first_file_from_json(file_lists_path):
    # Get first file from json
    files = load_file_list_from_json(file_lists_path)
    if files:
        file = files[0]
        files.pop(0)
        save_file_list_as_json(files, file_lists_path)
        return file
    else:
        return ''
    
def print_file_from_arg():
    # get directory from arg
    directory = get_directory_from_arg()
    file_lists_path = directory + '/file_lists.json'
    # if file_lists.json does not exist, create it
    if not os.path.exists(file_lists_path):
        # list files in directory
        files = list_files(directory)
        # build json file name from directory
        # save files as json
        save_file_list_as_json(files, file_lists_path)

    # get first file from json
    file = get_first_file_from_json(file_lists_path)
    # print file
    print(file, end='')


if __name__ == "__main__":
    # prevent errors from being printed to console
    try:
        print_file_from_arg()
    except:
        pass
    
