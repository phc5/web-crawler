var request = require('request'); // used to make HTTP requests
var URL = require('url-parse'); // used to parse URLs
var cheerio = require('cheerio'); // used to parse and select links on page

var START_URL = process.argv[2];
var pagesVisited = [];
var pagesToVisit = [];

var isUrl = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/; // regex for URL check

if (isUrl.test(START_URL)) {
	var url = new URL(process.argv[2]);
	var baseURL = url.protocol + '//' + url.hostname;
	console.log(baseURL);
	pagesToVisit.push(START_URL);
	crawl();
} else {
	console.log('Given string is not a URL. Please check arg 2');
}

function crawl() {
	var nextPage = pagesToVisit.pop();
	if (nextPage in pagesVisited) {
		crawl();
	} else {
		visitPage(nextPage, crawl);
	}
}

function visitPage(url, callback) {
	pagesVisited[url] = true;
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		if (response.statusCode !== 200) {
			callback();
			return;
		}
		var $ = cheerio.load(body);
		var relativeLinks = $("a[href^='/']");
		console.log('Found ' + relativeLinks.length + ' relative links on page');
		relativeLinks.each(function() {
			if ($(this).attr('href')[0] + $(this).attr('href')[1] !== '//') {
				console.log($(this).attr('href'));
				pagesToVisit.push(baseURL + $(this).attr('href'));
			}
			
		})
		callback();
	})
}