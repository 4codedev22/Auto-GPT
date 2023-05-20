import requests
from bs4 import BeautifulSoup
import argparse
import json
from autogpt.commands.web_selenium import browse_website

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download and normalize the text from a webpage')
    parser.add_argument('url', help='The URL of the webpage to download text from')
    parser.add_argument('outputfile', help='The name of the file to write the text chunks to')
    parser.add_argument('questionFile', help='question file')

    args = parser.parse_args()
    with open(args.questionFile, 'r') as f:
        question = f.read()
    # if args.url is file .json
    if args.url.endswith('.json'):
        with open(args.url, 'r') as f:
            linksList = json.load(f)
        # Download and normalize the text from the webpage
        for url in linksList:
            chunks = browse_website(url, question=question)
            # Save the chunks to the output file as JSON
            with open(args.outputfile, 'a') as f:
                json.dump(chunks, f)
    else:
      
        # Split the text into chunks
        chunks = browse_website(args.url, question=question)
        # Save the chunks to the output file as JSON
        with open(args.outputfile, 'w') as f:
            json.dump(chunks, f)
