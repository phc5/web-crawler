var request = require('request'); // used to make HTTP requests
var URL = require('url-parse'); // used to parse URLs
var cheerio = require('cheerio'); // used to parse and select links on page

var startURL = process.argv[2];
var pagesVisited = [];
var pagesToVisit = [];
var resultArray = [];
var pageVisited = 0;

var isUrl = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/; // regex for URL check

if (isUrl.test(startURL)) {
	var url = new URL(process.argv[2]);
	var baseURL = url.protocol + '//' + url.hostname;
	pagesToVisit.push(startURL);
	crawl();

} else {
	console.log('Error: Argument 2 is not a URL. Please include protocol and resource. For example: http://example.com');
}

function crawl() {
	if (pagesToVisit.length !== 0) {
		var nextPage = pagesToVisit.pop();
		if (nextPage in pagesVisited) {
			crawl();
		} else {
			resultArray.push({
				url: nextPage,
				assets: []
			})
			visitPage(nextPage, crawl);
		}
	} else {
		console.log(resultArray);
	}
}

function visitPage(url, callback) {
	pagesVisited[url] = true;
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		if (error || response.statusCode !== 200) {
			callback();
			return;
		}
		var $ = cheerio.load(body);

		getImages(body);
		getJS(body);
		getStylesheets(body);

		var relativeLinks = $("a[href^='/']");
		relativeLinks.each(function() {
			var sameLink = baseURL + $(this).attr('href');
			if ($(this).attr('href')[0] + $(this).attr('href')[1] !== '//') {
				pagesToVisit.push(baseURL + $(this).attr('href'));
			}
			
		})
		pageVisited++;
		callback();
	})
}

function getImages(body) {
	var $ = cheerio.load(body);
	var imgLinks = $('img');
	if (imgLinks.length !== 0) {
		imgLinks.each(function() {
			if ($(this).attr('src')) {
				if ($(this).attr('src')[0] + $(this).attr('src')[1] === '//') {
					resultArray[pageVisited].assets.push($(this).attr('src').slice(2));
				} else if ($(this).attr('src')[0] === '/') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('src'));
					
				} else {
					resultArray[pageVisited].assets.push($(this).attr('src'));
				}
			}
		});
	}
}

function getJS(body) {
	var $ = cheerio.load(body);
	var jsLinks = $('script');
	if (jsLinks.length !== 0) {
		jsLinks.each(function() {
			if ($(this).attr('src')) {
				if ($(this).attr('src')[0] + $(this).attr('src')[1] === '//') {
					resultArray[pageVisited].assets.push($(this).attr('src').slice(2));
				} else if ($(this).attr('src')[0] === '/') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('src'));
				} else {
					resultArray[pageVisited].assets.push($(this).attr('src'));
				}
			}
		});
	}
}

function getStylesheets(body) {
	var $ = cheerio.load(body);
	var stylesheetLinks = $('link');
	if (stylesheetLinks !== 0) {
		stylesheetLinks.each(function() {
			if ($(this).attr('href') && $(this).attr('rel') === 'stylesheet') {
				if ($(this).attr('href')[0] + $(this).attr('href')[1] === '//') {
					resultArray[pageVisited].assets.push($(this).attr('href').slice(2));
				} else if ($(this).attr('href')[0] === '/') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('href'));
				} else if ($(this).attr('href')[0] + $(this).attr('href')[1] === '..') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('href').slice(2));
				} else {
					resultArray[pageVisited].assets.push($(this).attr('href'));
				}
			}
		})
	}
}