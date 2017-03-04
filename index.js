/**
 * index.js is the starting point for this web crawler. It will prompt for the user to input a 
 * URL and will return error if that string is not a URL.
 *
 * @summary index.js is the starting point for crawler.js
 *
 * author - Paul Chong
 * date - Monday, February 27, 2017
 */

var crawler = require('./src/crawler.js');

/**
 * prompt() will send a prompt to the consoleand ask the user a question.
 *
 * @param {string} question - a question for the user.
 * @param {object} callback - a callback function.
 */
function prompt(question, callback) {
	let stdin = process.stdin;
	let stdout = process.stdout;

	stdin.resume();
	stdout.write(question);

	stdin.once('data', function(data) {
		callback(data.toString().trim());
	});
}

/**
 * Here we call prompt with a statement asking for the user input.
 * If the user input is a URL then we call crawl(),
 * otherwise, we throw an error.
 */
prompt('Please enter a URL to crawl...', function(input) {
	if (crawler.checkURL(input)) {
		crawler.crawl();
	} else {
		throw new Error('URL provided is incorrect format. Please include protocol and domain.');
		process.exit();
	}
})