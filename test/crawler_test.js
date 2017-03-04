/**
 * This file is for testing purposes only. 
 * Some functions are broken down so that I can get the count of certain features
 * such as relativeLinks and sources.
 *
 * Please refer to crawler.js  in the /src file for the original file.
 */

const request = require('request');
const URL = require('url-parse');
const cheerio = require('cheerio');
const fs = require('fs');

let pagesVisited = [];
let pagesToVisit = [];
let resultArray = [];
let baseURL = null;
let pageVisited = 0;
const srcArray = ['img', 'script'];
let urlNoProtocol = null; 

const checkURL = function(urlInput) {
	let isValidURL = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
	let url = new URL(urlInput);

	if (isValidURL.test(url)) {
		baseURL = url.protocol + '//' + url.hostname;
		pagesToVisit.push(baseURL + '/');
		return true;
	}
	return false;
}

/**
 * crawl() will go through the pagesToVisit array, skipping over pages that have been already been visited, and push 
 * an object to the resultArray. If there are no pages in pagesToVisit, then this function will console.log the resultArray.
 */
const crawl = function() {
	if (pagesToVisit.length > 0) {
		let nextPage = pagesToVisit.pop();

		if (nextPage in pagesVisited) {
			crawl();
		} else {
			resultArray.push({
				url: nextPage,
				assets: []
			});
			visitPage(nextPage, crawl);
		}
	} else if (pagesToVisit.length == 0) {
		fs.writeFile('./output.txt', JSON.stringify(resultArray, null, 2), function(error) {
			if (error) {
				console.error('Write error:', error.message);
			} else {
				console.log('Write success to output.txt');
				process.exit();
			}
		});
	}
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
		urlNoProtocol = baseURL.replace(/^https:?\:\/\//i,"");

		for (let i = 0 ; i < srcArray.length; i++) {
			getSources(body, srcArray[i]);
		}

		getStylesheets(body);
		getRelativeLinks(body);
		
		pageVisited++;
		callback();
	})
}

function getRelativeLinksCount(body) {
	let $ = cheerio.load(body);
	let relativeLinks = $("a[href^='/']");
	return relativeLinks.length;		
}

function getRelativeLinks(body) {
	let $ = cheerio.load(body);
	let relativeLinks = $("a[href^='/']");		
	if (relativeLinks.length > 0) {
		relativeLinks.each(function() {
			if ($(this).attr('href')[0] + $(this).attr('href')[1] === '//') {
				if ($(this).attr('href').slice(2) === urlNoProtocol + $(this).attr('href').slice(urlNoProtocol.length + 2)) {
					pagesToVisit.push($(this).attr('href').slice(2));
				}
			} else if ($(this).attr('href')[0] === '/' && $(this).attr('href')[1] !== '/') {
				pagesToVisit.push(baseURL + $(this).attr('href'));
			}
		});
	}
}

function getSourcesCount(body, tag) {
	let $ = cheerio.load(body);
	let sourceLinks = $(tag);
	return sourceLinks.length;
}

// stackoverflow.com/questions/3999764/taking-off-the-http-or-https-off-a-javascript-string
// let urlNoProtocol = baseURL.replace(/^https?\:\/\//i, ""); 

/**
 * getSources() will go through the given body and search for the given tag and push all 'src's into the the current
 * page's assets array in the resultArray.
 *
 * @param {String} body
 * @param {String} tag
 */
function getSources(body, tag) {
	let $ = cheerio.load(body);
	let sourceLinks = $(tag);
	if (sourceLinks.length > 0) {
		sourceLinks.each(function() {
			if ($(this).attr('src')) {
				if ($(this).attr('src')[0] + $(this).attr('src')[1] === '//') {
					if ($(this).attr('src').slice(2) === urlNoProtocol + $(this).attr('src').slice(urlNoProtocol.length + 2)) {
						resultArray[pageVisited].assets.push($(this).attr('src').slice(2));
					} else {
						resultArray[pageVisited].assets.push($(this).attr('src').slice(2));
					}
				} else if ($(this).attr('src')[0] === '/') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('src'));
				} else {
					resultArray[pageVisited].assets.push($(this).attr('src'));
				}
			}
		});
	}
}

/**
 * getStylesheets() will go through the given body and search for the link tag and push all 'href's into the current
 * page's assets array in the resultArray.
 *
 * @param {String} body
 */
function getStylesheets(body) {
	let $ = cheerio.load(body);
	let stylesheetLinks = $('link');
	if (stylesheetLinks > 0) {
		stylesheetLinks.each(function() {
			if ($(this).attr('href') && $(this).attr('rel') === 'stylesheet') {
				if ($(this).attr('href')[0] + $(this).attr('href')[1] === '//') {
					resultArray[pageVisited].assets.push($(this).attr('href').slice(2));
				} else if ($(this).attr('href')[0] === '/') {
					resultArray[pageVisited].assets.push(baseURL + $(this).attr('href'));
				} else {
					resultArray[pageVisited].assets.push($(this).attr('href'));
				}
			}
		});
	}
}

exports.checkURL = checkURL;
exports.crawl = crawl;
exports.visitPage = visitPage;
exports.pagesToVisit = pagesToVisit;
exports.getRelativeLinksCount = getRelativeLinksCount;
exports.getRelativeLinks = getRelativeLinks;
exports.getSourcesCount = getSourcesCount;
exports.getSources = getSources