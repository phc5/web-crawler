# A Simple Web Crawler using JavaScript

Given a starting URL, this web crawler will visit every reachable page under that domain and return, in JSON format, the URL of the page visited as well as an array of every static assset (images, javascript, stylesheets) found on the page. This web crawler should not cross subdomains (if starting at https://www.google.com, it should not crawl https://mail.google.com).



Output Example:
```
[
	{
		"url": 'https://www.example.com',
		"assets": [
			"http://www.example.com/image.jpg",
			"http://www.example.com/script.js"
		]
	},
	{
		"url": "https://www.example.com/about",
		"assets": [
			"http://www.example.com/company_photo.jpg",
			"http://www.example.com/script.js"
		]
	}
]
``` 

# Install

Before cloning this repo, make sure you have the latest version of <a href="http://nodejs.org/en/download/" target="_blank">Node</a> installed. 

1. Clone this repository. In your terminal, type: `git clone https://github.com/phc5/web-crawler.git`
2. Change directory into the project directory: `cd web-crawler`, or if you named the project something else `cd [project-name]`
3. Install dependencies `npm install`

# Usage

1. in your project directory, run the web crawler by typing: `node index.js`
 
2. You will be prompted to enter a URL.
	* URL must have protocol and domain. For example, https://www.google.com will work. www.google.com WILL NOT work.
3. Get results in JSON format in an output.txt file. Web crawler may take some time to visit all reachable pages. 

# TODOs

- [x] Research web crawlers.
- [x] Look up npm packages/modules that can help make HTTP requests, parse URL, and body of page.
- [x] Be able to visit every reachable page from a starting URL point
- [x] Output in JSON format ( {url: "...", assets: []} )
- [x] Get static asset: images 
- [x] Get static asset: js
- [x] Get static asset: stylesheets
- [x] Write tests
- [x] Documentation 
- [ ] Think of other TODOs

# Links I Found Helpful

- [What are web crawlers?](https://en.wikipedia.org/wiki/Web_crawler)
- [npm request](https://www.npmjs.com/package/request)
- [npm cheerio](https://www.npmjs.com/package/cheerio)
- [npm url-parse](https://www.npmjs.com/package/url-parse)

# Contributing / Comments

Please feel free to fork, push a change, and submit a pull request for any improvements. 

Also, any suggestions and/or comments are welcome. I am a young developer looking to learn and grow. 