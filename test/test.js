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
	});
	it('should have 63 pages to visit after visiting https://www.gocardless.com', function() {
		let nextPage = crawler.pagesToVisit[0];
		request(nextPage, function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			assert.equal(crawler.getRelativeLinksCount(body), 63);
		});
	});
	it('should visit /en-se first and /nl-nl second', function() {
		let nextPage = crawler.pagesToVisit[0];
		request(nextPage, function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			crawler.getRelativeLinks(body);
			assert.equal(crawler.pagesToVisit.pop(), 'https://www.gocardless.com/en-se');
			assert.equal(crawler.pagesToVisit.pop(), 'https://www.gocardless.com/nl-nl');
		});
	});
});

describe('getSources()', function() {
	it('should get 14 sources for img tag for the first link', function() {
		request('https://www.gocardless.com', function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			assert.equal(crawler.getSourcesCount(body, 'img'), 14);
		});
	});
	it('should get 8 sources for script tag for the first link', function() {
		request('https://www.gocardless.com', function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			assert.equal(crawler.getSourcesCount(body, 'script'), 8);
		});
	});
	it('should have `/images/logos/pro-logs-colour@2x.png as first asset for the first link', function() {
		request('https://www.gocardless.com', function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			crawler.getSources(body, 'img')
			assert.equal(crawler.resultArray[0].assets[0], 'https://www.gocardless.com/images/logos/pro-logos-colour@2x.png');
		});
	});
});

describe('getStyleSheets()', function() {
	it('should get 32 link tags for the first link', function() {
		request('https://www.gocardless.com', function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			assert.equal(crawler.getStylesheetsCount(body), 32);
		});
	});
	it('should have `/bundle/main-6c306d8abc5e829e4cbf.css` for the first link', function() {
		request('https://www.gocardless.com', function(error, response, body) {
			if (err || response.statusCode !== 200) {
				return;
			}
			crawler.getStylesheets(body);
			assert.equal(crawler.resultArray[0].assets[crawler.resultArray[0].assets.length - 1], 'https://www.gocardless.com/bundle/main-6c306d8abc5e829e4cbf.css');
		});
	});
});