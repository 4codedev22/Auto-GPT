
import json
from commands.file_operations import append_to_file, read_file, write_to_file
from commands.web_requests import scrape_text
from processing.text import summarize_text

if __name__ == "__main__":
    # parser = argparse.ArgumentParser(description='Download and normalize the text from a webpage')
    # parser.add_argument('url', help='The URL of the webpage to download text from')
    # parser.add_argument('outputfile', help='The name of the file to write the text chunks to')
    # parser.add_argument('questionFile', help='question file')

    # args = parser.parse_args()
    url = 'autogpt_diagnoses/hyperlinks.json' 
    questionFile = 'autogpt_diagnoses/questions.txt'
    outputfile = 'autogpt_diagnoses/data.json'

    questions = read_file(questionFile)
    if url.endswith('.json'):
        linksList = json.loads(read_file(url))
        print(linksList)
        for siteURL in linksList:
            text = scrape_text(siteURL)
            print(text, siteURL, questions)
            chunks =  summarize_text(siteURL, text, questions)
            append_to_file(outputfile, chunks, True)
    else:
        # Split the text into chunks
        siteURL = url
        text = scrape_text(siteURL)
        chunks =  summarize_text(siteURL, text, questions)
        write_to_file(outputfile, chunks)
