"""Code evaluation module."""
from __future__ import annotations
from ast import Dict
import json

from autogpt.commands.command import command
from autogpt.llm import call_ai_function
from autogpt.commands.file_operations import split_file
from autogpt.commands.file_operations_utils import read_textual_file

from autogpt.logs import logger
from autogpt.commands.improve_code import improve_split_typescript_code

@command(
    "analyze_code",
    "Analyze Code",
    '"code": "<full_code_string>"',
)
def analyze_code(code: str) -> list[str]:
    """
    A function that takes in a string and returns a response from create chat
      completion api call.

    Parameters:
        code (str): Code to be evaluated.
    Returns:
        A result string from create chat completion. A list of suggestions to
            improve the code.
    """

    function_string = "def analyze_code(code: str) -> list[str]:"
    args = [code]
    description_string = (
        "Analyzes the given code and returns a list of suggestions for improvements."
    )

    return call_ai_function(function_string, args, description_string)



@command(
    "analyze_typescript_code",
    "Analyze Typescript Code",
    '"code": "<full_code_string>"',
)
def analyze_typescript_code(code: str) -> list[str]:
    """
    A function that takes in a string and returns a response from create chat
      completion api call.

    Parameters:
        code (str): Typescript code to be evaluated.
    Returns:
        A result string from create chat completion. A list of suggestions to
            improve the code.
    """

    function_string = "def analyze_typescript_code(code: str) -> list[str]:"
    args = [code]
    description_string = (
        "Analyzes the typescritpt given code and returns a list of suggestions for improvements."
    )

    return call_ai_function(function_string, args, description_string)



@command(
    "split_typescript_code",
    "Split Typescript Code",
    '"code": "<full_code_string>"',
)
def split_typescript_code(code: str) -> list[str]:
    """
    A function that takes in a string and returns a response from create chat
      completion api call.

    Parameters:
        code (str): Typescript code to be evaluated.
    Returns:
        A result string from create chat completion. A list of classes and implementations to
            improve the code.
    """

    function_string = "def split_typescript_class_into_smaller_classes(code: str) -> list[str]:"
    args = [code]
    description_string = (
        "Analyzes the typescript given class code and returns a list of suggestions for improvements."
    )

    return call_ai_function(function_string, args, description_string)


def split_typescript_code_from_filename(filename: str) -> list[str]:
    """
    A function that takes in a string and returns a response from create chat
      completion api call.

    Parameters:
        code (str): Typescript code to be evaluated.
    Returns:
        A result string from create chat completion. A list of classes and implementations to
            improve the code.
    """

    text = read_textual_file(filename, logger)
    chunks =  list(split_file(text, max_length=8000))
    suggestions = []
    for i, chunk in enumerate(chunks):
        logger.info(f"Chunk {i + 1} / {len(chunks)} length: {len(chunk)} characters")
        suggestion =  split_typescript_code(chunk)
        suggestions.append(suggestion)

    with open(filename + ".split.json", "w") as f:
        json.dump(suggestions, f, indent=4)
    return suggestions
