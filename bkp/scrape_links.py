import argparse
import json

from autogpt.commands.web_requests import scrape_clean_links



def scrape_links_deep (url, domain, result):
    print(url)
    hyperlinks = scrape_clean_links(url)


    links = [link_url.split('#')[0] for link_text, link_url in hyperlinks if domain in link_url]
    links = list(set(links))
    #remove all links that are already in the result
    links = [link for link in links if link not in result]

    if len(links) == 0:
        return []

    print("links")
    print('\n'.join(links))
    result.extend(links)
    for link in links:
        scrape_links_deep(link, domain, result)



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Web scraper that recursively fetches all links from a given webpage')
    parser.add_argument('url', help='The URL to start scraping from')
    parser.add_argument('output', help='The output file name')

    args = parser.parse_args()

    domain = args.url.split('/')[2]

    result = []
    scrape_links_deep(args.url, domain, result)
    with open(args.output, 'w') as f:
        json.dump(list(set(result)), f)
