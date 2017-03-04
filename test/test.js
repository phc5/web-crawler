const assert = require('assert');
const request = require('request');
const crawler = require('./crawler_test.js');

describe('checkURL()', function() {
	it('should return false if string has no protocol', function() {
		assert.equal(crawler.checkURL('www.google.com'), false);
	});
	it('should return false if string is not in URL format', function() {
		assert.equal(crawler.checkURL('testing123'), false);
	});
	it('should return true if string is in URL', function() {
		assert.equal(crawler.checkURL('https://www.gocardless.com'), true);
	});
	it('should add a `/` to the end of the URL and push it to the pagesToVisit array', function() {
		assert.equal(crawler.pagesToVisit[0], 'https://www.gocardless.com/');
	});
});

describe('visitPage() and getRelativeLinks()', function() {
	it('should have 1 page to visit initially', function() {
		assert.equal(crawler.pagesToVisit.length, 1);
		console.log(crawler.pagesToVisit.length);
	});
	it('should have 63 pages to visit after visiting https://www.gocardless.com', function() {
		let nextPage = crawler.pagesToVisit[0];
		request(nextPage, function(error, repsonse, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			assert.equal(crawler.getRelativeLinksCount(body).length, 63);
		});
	});
	it('should visit /en-se first and /nl-nl second', function() {
		let nextPage = crawler.pagesToVisit[0];
		request(nextPage, function(error, repsonse, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			crawler.getRelativeLinks(body);
			assert.equal(crawler.pagesToVisit.pop(), 'https://www.gocardless.com/en-se');
			assert.equal(crawler.pagesToVisit.pop(), 'https://www.gocardless.com/nl-nl');

		});
	});
});