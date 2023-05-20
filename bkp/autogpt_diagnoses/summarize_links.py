# Import necessary libraries
import json
import requests
from bs4 import BeautifulSoup

# Read hyperlinks.json
with open('hyperlinks.json', 'r') as f:
    hyperlinks = json.load(f)

# Initialize data list
results = []

# Loop through each link
for link in hyperlinks:
    # Get the URL and question
    url = link['url']
    question = link['question']
    
    # Get the HTML content
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Summarize the text
    text = soup.get_text()
    summary = text[:500]
    
    # Look for answers to the question
    answer = 'Answer not found.'
    if question in text:
        answer = 'Answer found.'
    
    # Append the result to the data list
    results.append({'url': url, 'question': question, 'summary': summary, 'answer': answer})

# Write the results to data.json
with open('data.json', 'w') as f:
    json.dump(results, f, indent=4)