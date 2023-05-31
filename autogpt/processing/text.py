"""Text processing functions"""
from typing import Callable, Dict, Generator, Optional

import spacy
from selenium.webdriver.remote.webdriver import WebDriver

from autogpt.config import Config
from autogpt.llm import count_message_tokens, create_chat_completion
from autogpt.logs import logger
from autogpt.memory import get_memory
from autogpt.commands.analyze_code import analyze_typescript_code
from autogpt.commands.improve_code import improve_typescript_code
from autogpt.commands.file_operations_utils import read_textual_file
CFG = Config()


def split_text(
    text: str,
    max_length: int = CFG.browse_chunk_max_length,
    model: str = CFG.fast_llm_model,
    question: str = "",
) -> Generator[str, None, None]:
    """Split text into chunks of a maximum length

    Args:
        text (str): The text to split
        max_length (int, optional): The maximum length of each chunk. Defaults to 8192.

    Yields:
        str: The next chunk of text

    Raises:
        ValueError: If the text is longer than the maximum length
    """
    flattened_paragraphs = " ".join(text.split("\n"))
    nlp = spacy.load(CFG.browse_spacy_language_model)
    nlp.add_pipe("sentencizer")
    doc = nlp(flattened_paragraphs)
    sentences = [sent.text.strip() for sent in doc.sents]

    current_chunk = []

    for sentence in sentences:
        message_with_additional_sentence = [
            create_message(" ".join(current_chunk) + " " + sentence, question)
        ]

        expected_token_usage = (
            count_message_tokens(messages=message_with_additional_sentence, model=model)
            + 1
        )
        if expected_token_usage <= max_length:
            current_chunk.append(sentence)
        else:
            yield " ".join(current_chunk)
            current_chunk = [sentence]
            message_this_sentence_only = [
                create_message(" ".join(current_chunk), question)
            ]
            expected_token_usage = (
                count_message_tokens(messages=message_this_sentence_only, model=model)
                + 1
            )
            if expected_token_usage > max_length:
                raise ValueError(
                    f"Sentence is too long in webpage: {expected_token_usage} tokens."
                )

    if current_chunk:
        yield " ".join(current_chunk)


def summarize_text(
    url: str, text: str, question: str, driver: Optional[WebDriver] = None
) -> str:
    """Summarize text using the OpenAI API

    Args:
        url (str): The url of the text
        text (str): The text to summarize
        question (str): The question to ask the model
        driver (WebDriver): The webdriver to use to scroll the page

    Returns:
        str: The summary of the text
    """
    if not text:
        return "Error: No text to summarize"

    model = CFG.fast_llm_model
    text_length = len(text)
    logger.info(f"Text length: {text_length} characters")

    summaries = []
    chunks = list(
        split_text(
            text, max_length=CFG.browse_chunk_max_length, model=model, question=question
        ),
    )
    scroll_ratio = 1 / len(chunks)

    for i, chunk in enumerate(chunks):
        if driver:
            scroll_to_percentage(driver, scroll_ratio * i)
        logger.info(f"Adding chunk {i + 1} / {len(chunks)} to memory")

        memory_to_add = f"Source: {url}\n" f"Raw content part#{i + 1}: {chunk}"

        memory = get_memory(CFG)
        memory.add(memory_to_add)

        messages = [create_message(chunk, question)]
        tokens_for_chunk = count_message_tokens(messages, model)
        logger.info(
            f"Summarizing chunk {i + 1} / {len(chunks)} of length {len(chunk)} characters, or {tokens_for_chunk} tokens"
        )

        summary = create_chat_completion(
            model=model,
            messages=messages,
        )
        summaries.append(summary)
        logger.info(
            f"Added chunk {i + 1} summary to memory, of length {len(summary)} characters"
        )

        memory_to_add = f"Source: {url}\n" f"Content summary part#{i + 1}: {summary}"

        memory.add(memory_to_add)

    logger.info(f"Summarized {len(chunks)} chunks.")

    combined_summary = "\n".join(summaries)
    messages = [create_message(combined_summary, question)]

    return create_chat_completion(
        model=model,
        messages=messages,
    )


def summarize_typescript_text(
    file: str
) -> str:
    
    """Summarize text using the OpenAI API

    Args:
        file (str): The file with the typescript text

    Returns:
        str: The summary of the typescript text
    """
    if not file:
        return "Error: No typescript file to read text"



    question = 'What is the class and methods to this part of the code?'
    model = CFG.fast_llm_model
    text = read_textual_file(file, logger)
    text_length = len(text)
    logger.info(f"Text length: {text_length} characters")

    summaries = []
    chunks = list(
        split_text(
            text, max_length=CFG.browse_chunk_max_length, model=model, question=question
        ),
    )

    for i, chunk in enumerate(chunks):
        logger.info(f"Adding chunk {i + 1} / {len(chunks)} to memory")

        memory_to_add = f"Source: {file}\n" f"Raw content part#{i + 1}: {chunk}"

        memory = get_memory(CFG)
        memory.add(memory_to_add)

        messages = [create_typescript_message(chunk, question)]
        tokens_for_chunk = count_message_tokens(messages, model)
        logger.info(
            f"Summarizing chunk {i + 1} / {len(chunks)} of length {len(chunk)} characters, or {tokens_for_chunk} tokens"
        )

        summary = create_chat_completion(
            model=model,
            messages=messages,
        )
        summaries.append(summary)
        logger.info(
            f"Added chunk {i + 1} summary to memory, of length {len(summary)} characters"
        )

        memory_to_add = f"Source: {file}\n" f"Content summary part#{i + 1}: {summary}"

        memory.add(memory_to_add)

    logger.info(f"Summarized {len(chunks)} chunks.")

    combined_summary = "\n".join(summaries)
    messages = [create_typescript_message(combined_summary, 'What is the structure of the code?')]

    return create_chat_completion(
        model=model,
        messages=messages,
    )




def analyze_typescript_file(
    filename: str
) -> Dict[str,str]:
    
    """Analyze typescript from filename using the OpenAI API

    Args:
        filename (str): The filename with the typescript text

    Returns:
        Dict[str, str]: The typescript structure code and previous summaries
    """
    if not filename:
        return "Error: No typescript file to read text"



    question = 'What this part means?'
    model = CFG.fast_llm_model
    text = read_textual_file(filename, logger)
    text_length = len(text)
    logger.info(f"Text length: {text_length} characters")

    summaries = []
    chunks = list(
        split_text(
            text, max_length=CFG.fast_token_limit, model=model, question=question
        ),
    )

    for i, chunk in enumerate(chunks):
        logger.info(f"Adding chunk {i + 1} / {len(chunks)} to memory")

        memory_to_add = f"Source: {filename}\n" f"Raw content part#{i + 1}: {chunk}"

        memory = get_memory(CFG)
        memory.add(memory_to_add)

        messages = [create_typescript_message(chunk)]
        tokens_for_chunk = count_message_tokens(messages, model)
        logger.info(
            f"Summarizing chunk {i + 1} / {len(chunks)} of length {len(chunk)} characters, or {tokens_for_chunk} tokens"
        )

        summary = create_chat_completion(
            model=model,
            messages=messages,
        )
        summaries.append(summary)
        logger.info(
            f"Added chunk {i + 1} summary to memory, of length {len(summary)} characters"
        )

        memory_to_add = f"Source: {filename}\n" f"Content summary part#{i + 1}: {summary}"

        memory.add(memory_to_add)

    logger.info(f"Summarized {len(chunks)} chunks.")

    combined_summary = "\n".join(summaries)
    messages = [create_typescript_final_message(combined_summary)]

    final_combination =  create_chat_completion(
        model=model,
        messages=messages,
    )

    return {
        "final_combination": final_combination,
        "summaries": summaries,
    }




def analyze_chuncked_code(
    url: str, text: str,
    question: str = "",

) -> Dict[str, str]:
    """Summarize text using the OpenAI API

    Args:
        url (str): The url of the text
        text (str): The text to summarize
        question (str): The question to ask the model
        driver (WebDriver): The webdriver to use to scroll the page

    Returns:
        str: The summary of the text
    """
    if not text:
        return "Error: No text to summarize"

    model = CFG.fast_llm_model
    text_length = len(text)
    logger.info(f"Text length: {text_length} characters")

    analyze_summaries = []
    improve_summaries = []
    chunks = list(
        split_text(
            text, max_length=CFG.browse_chunk_max_length, model=model, question=question
        ),
    )
    for i, chunk in enumerate(chunks):
        
        logger.info(f"Adding chunk {i + 1} / {len(chunks)} to memory")

        memory_to_add = f"Source: {url}\n" f"Raw content part#{i + 1}: {chunk}"

        memory = get_memory(CFG)
        memory.add(memory_to_add)

       
        analyze_summary = analyze_typescript_code(chunk)
        improve_summary = improve_typescript_code(analyze_summary, chunk)
        analyze_summaries.append(analyze_summary)
        improve_summaries.append(improve_summary)
        logger.info(
            f"Added chunk {i + 1} analyze_summary to memory, of length {len(analyze_summary)} characters"
        )
        logger.info(
            f"Added chunk {i + 1} improve_summary to memory, of length {len(improve_summary)} characters"
        )

        memory_to_add = f"Source: {url}\n" f"Content analyze_summary part#{i + 1}: {analyze_summary}"
        memory.add(memory_to_add)
        memory_to_add = f"Source: {url}\n" f"Content improve_summary part#{i + 1}: {improve_summary}"
        memory.add(memory_to_add)


    logger.info(f"analyze {len(chunks)} chunks.")

    return {
        'analyze_summaries': analyze_summaries,
        'improve_summaries': improve_summaries,
    }


def scroll_to_percentage(driver: WebDriver, ratio: float) -> None:
    """Scroll to a percentage of the page

    Args:
        driver (WebDriver): The webdriver to use
        ratio (float): The percentage to scroll to

    Raises:
        ValueError: If the ratio is not between 0 and 1
    """
    if ratio < 0 or ratio > 1:
        raise ValueError("Percentage should be between 0 and 1")
    driver.execute_script(f"window.scrollTo(0, document.body.scrollHeight * {ratio});")


def create_message(chunk: str, question: str) -> Dict[str, str]:
    """Create a message for the chat completion

    Args:
        chunk (str): The chunk of text to summarize
        question (str): The question to answer

    Returns:
        Dict[str, str]: The message to send to the chat completion
    """
    return {
        "role": "user",
        "content": f'"""{chunk}""" Using the above text, answer the following'
        f' question: "{question}" -- if the question cannot be answered using the text,'
        " summarize the text.",
    }



def create_typescript_message(chunk: str) -> Dict[str, str]:
    """Create a message for the chat completion

    Args:
        chunk (str): The chunk of typescript code to answer
        question (str): The typescript question to answer

    Returns:
        Dict[str, str]: The message to send to the chat completion
    """
    return {
        "role": "user",
        "content": f'"""{chunk}""" Using the above typescript code, answer the following'
        f' question: What this code is and do? -- if the question cannot be answered using the text,'
        " summarize the code.",
    }


def create_typescript_final_message(chunk: str) -> Dict[str, str]:
    """Create a message for the chat completion

    Args:
        chunk (str): The chunk of typescript text to summarize

    Returns:
        Dict[str, str]: The message to send to the chat completion
    """
    return {
        "role": "user",
        "content": f'"""{chunk}""" Using the above typescript code, write comments in the typescript code structure.',
    }


def create_typescript_split_message(chunk: str) -> Dict[str, str]:
    """Create a message for the chat completion

    Args:
        chunk (str): The chunk of typescript text to summarize

    Returns:
        Dict[str, str]: The message to send to the chat completion
    """
    return {
        "role": "user",
        "content": f'"""{chunk}""" Using the above typescript text, guive me the final typescript structure and add insights as comments of multiline format to be a valid typescript code.',
    }

