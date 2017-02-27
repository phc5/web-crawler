var request = require('request'); // used to make HTTP requests
var URL = require('url-parse'); // used to parse URLs
var cheerio = require('cheerio'); // used to parse and select links on page

console.log(process.argv[2]);

const startingURL = process.argv[2];

request(startingURL, (err, response, body) => {
	if (err) {
		console.log('Error: ' + error);
	}

	if (response.statusCode === 200) {
		var $ = cheerio.load(body);
		console.log('Title: ' + $('title').text());
		// var allRelativeLinks = [];

		// var relativeLinks = $("a[href^='/']");
		// relativeLinks.each(() => {
		// 	allRelativeLinks.push($(this).attr('href'));
		// });

		// console.log('Found ' + allRelativeLinks.length + ' relative links');
	}
});