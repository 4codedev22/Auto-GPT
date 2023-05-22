# Import necessary libraries
import requests
from bs4 import BeautifulSoup

# Define the URL to scrape
url = 'https://www.aguiacontabilidadego.com.br/'

# Send a GET request to the URL
response = requests.get(url)

# Parse the HTML content of the response
soup = BeautifulSoup(response.content, 'html.parser')

# Extract the necessary information from the HTML content
owner = soup.find('div', class_='owner').text
services = soup.find('div', class_='services').text
products = soup.find('div', class_='products').text
business = soup.find('div', class_='business').text

# Print the information
print('Owner:', owner)
print('Services:', services)
print('Products:', products)
print('Business:', business)
