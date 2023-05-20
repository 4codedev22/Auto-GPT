# Import the necessary libraries
from bs4 import BeautifulSoup
import requests

# Define the URL to be scraped
url = 'https://www.phdsistemas.com.br/'

# Send a GET request to the URL
response = requests.get(url)

# Parse the HTML content of the response
soup = BeautifulSoup(response.content, 'html.parser')

# Find the relevant tags and attributes to extract the information
modules = soup.find_all('div', {'class': 'col-md-4'})

# Print the extracted information
for module in modules:
    print(module.h3.text)
    print(module.p.text)
    print() 