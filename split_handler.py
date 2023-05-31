
import json
import sys
from typing import Dict

from autogpt.config import Config
from autogpt.commands.analyze_code import split_typescript_code_from_filename

cfg = Config()

def get_file_from_args():
    # Get the first argument from the command line
    arg = sys.argv[1] if len(sys.argv) > 1 else ''
    return arg

def read_text_from_file(file):
    # Read text from file
    with open(file, 'r') as f:
        text = f.read()
    return text

def create_message(chunk: str, instruct: str) -> Dict[str, str]:
    """Create a message for the chat completion

    Args:
        chunk (str): The chunk of text to summarize
        question (str): The question to answer

    Returns:
        Dict[str, str]: The message to send to the chat completion
    """
    return {
        "role": "user",
        "content": f'"""{chunk}""" Using the above text do the following.'
        f' You are ordered to do: "{instruct}" -- if you cant do it,'
        " wait for more instructions.",
    }

def get_question_from_args():
    # Get the second argument from the command line
    arg = sys.argv[2] if len(sys.argv) > 2 else ''
    return arg


def slipt_typescript_class_into_methods(file):
    # get filecontent
    with open(file, 'r') as f:
        filecontent = f.read()
    


def writes_response_to_json_file(filename, dict_content):
    # get filename extension
    extension = filename.split('.')[-1]
    # remove extension from filename
    filename = filename.replace(f'.{extension}', '')
    # add _suggestions.json to filename
    filename = f'{filename}_suggestions.json'
    # write suggestions to json file
    with open(filename, 'w') as f:
        json.dump(dict_content, f)
    return filename

if __name__ == "__main__":
    # prevent errors from being printed to console
    try:
        # get file from args
        file = get_file_from_args()
        analyzing = split_typescript_code_from_filename(file)
        print(analyzing)
    except:
        pass
