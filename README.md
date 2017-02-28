# A Simple Web Crawler

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

# Usage