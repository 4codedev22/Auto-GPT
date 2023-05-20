import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from bs4 import BeautifulSoup

class SiteParserSpider(CrawlSpider):
    name = 'siteparser'
    allowed_domains = ['phdsistemas.com.br']
    start_urls = ['https://www.phdsistemas.com.br/']
    rules = (
        Rule(LinkExtractor(allow_domains=allowed_domains), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        soup = BeautifulSoup(response.text, 'html.parser')
        
        text = soup.get_text()
        sentences = text.split('.')
        sentences = [s.strip() for s in sentences if s.strip()]
        yield {
            'sentences': sentences
        }
