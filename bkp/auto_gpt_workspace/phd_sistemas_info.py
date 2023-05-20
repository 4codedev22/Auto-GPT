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

# Write the extracted information to a file
with open('phd_sistemas_info.txt', 'w') as f:
    for module in modules:
        f.write(module.h3.text + '\n')
        f.write(module.p.text + '\n\n')