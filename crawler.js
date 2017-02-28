/**
 * crawler.js is a simple web crawler that will visit every reachable page from a starting URL. This web crawler should
 * not cross subdomains. For example, when crawling http://www.example.com, it should not crawl http://mail.example.com. For
 * each page, this crawler should determine the URL of every static asset on that page. Static assets include images, javascript
 * files, and CSS stylesheets. This crawler should output to console in JSON format a list of all static assets grouped by 
 * what page they were found on.
 * 
 * @summary crawler.js is a simple web crawler that will get all static assets for every reachable page from a starting URL.
 *
 * author - Paul Chong
 * date - Monday, February 27, 2017
 */

// used to make HTTP requests
var request = require('request');

// used to parse URLs
var URL = require('url-parse');

// used to parse and select links on page
var cheerio = require('cheerio'); 

var startURL = process.argv[2];
var pagesVisited = [];
var pagesToVisit = [];
var resultArray = [];

const srcArray = ['img', 'script'];
var pageVisited = 0;

// regex for URL check
var isUrl = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/; 

if (isUrl.test(startURL)) {
	var url = new URL(process.argv[2]);
	var baseURL = url.protocol + '//' + url.hostname;
	pagesToVisit.push(startURL);
	crawl();

} else {
	console.log('Error: Argument 2 is not a URL. Please include protocol and resource. For example: http://example.com');
}

/**
 * crawl() will go through the pagesToVisit array, skipping over pages that have been already been visited, and push 
 * an object to the resultArray. If there are no pages in pagesToVisit, then this function will console.log the resultArray.
 */
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
	return;
}

/**
 * visitPage() will make an HTTP request to the given URL, call getSources() and getStylesheets() on the response body, 
 * and go through all relative links of the given URL and push them into the pagesToVisit array.
 *
 * @param {String} url
 * @param {Object} callback
 */
function visitPage(url, callback) {
	pagesVisited[url] = true;
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		if (error || response.statusCode !== 200) {
			callback();
			return;
		}
		var $ = cheerio.load(body);

		for (let i = 0 ; i < srcArray.length; i++) {
			getSources(body, srcArray[i]);
		}

		console.log(typeof body)
		getStylesheets(body);

		var relativeLinks = $("a[href^='/']");
		relativeLinks.each(function() {
			
			var urlNoProtocol = baseURL.replace(/^https?\:\/\//i, ""); // stackoverflow.com/questions/3999764/taking-off-the-http-or-https-off-a-javascript-string
			
			if ($(this).attr('href')[0] + $(this).attr('href')[1] === '//') {
				if ($(this).attr('href').slice(2) === urlNoProtocol + $(this).attr('href').slice(urlNoProtocol.length + 2)) {
					pagesToVisit.push($(this).attr('href').slice(2));
				}
			} else if ($(this).attr('href')[0] === '/') {
				pagesToVisit.push(baseURL + $(this).attr('href'));
			}
		})
		pageVisited++;
		callback();
	})
	return;
}

/**
 * getSources() will go through the given body and search for the given tag and push all 'src's into the the current
 * page's assets array in the resultArray.
 *
 * @param {String} body
 * @param {String} tag
 */
function getSources(body, tag) {
	var $ = cheerio.load(body);
	var imgLinks = $(tag);
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
	return;
}

/**
 * getStylesheets() will go through the given body and search for the link tag and push all 'href's into the current
 * page's assets array in the resultArray.
 *
 * @param {String} body
 */
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
	return;
}