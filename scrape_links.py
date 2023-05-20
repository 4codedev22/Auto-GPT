import argparse
import json

from autogpt.commands.web_requests import scrape_links

def scrape_links_deep(url):
    # scrape the links recursively filter by domain
    for link_url in scrape_links(url) :
        links.extend(scrape_links_deep(link_url))
    domain = url.split('/')[2]
    links = [link for link in links if domain in link]
    links_to_return = []
    print(links)
    for link in links:
        links_to_return.append(link)
        links_to_return.extend(scrape_links_deep(link))
    return links_to_return


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Web scraper that recursively fetches all links from a given webpage')
    parser.add_argument('url', help='The URL to start scraping from')

    # receive output file name as a command-line argument
    parser.add_argument('output', help='The output file name')

    args = parser.parse_args()
    print(args.url, args.output)
    links = scrape_links_deep(args.url)
    with open(args.output, 'a') as f:
        json.dump(links, f)
