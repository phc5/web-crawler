var assert = require('assert');
var crawler = require('./crawler.js');

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when then value is not present', function() {
			assert.equal(-1, [1,2,3].indexOf(4));
		});
		it('should return hello world', function() {
			console.log(crawler.helloWorld())
			assert.equal('hello world', crawler.helloWorld());
		})
	})
})