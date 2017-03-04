var crawler = require('./src/crawler.js');

function prompt(question, callback) {
	let stdin = process.stdin;
	let stdout = process.stdout;

	stdin.resume();
	stdout.write(question);

	stdin.once('data', function(data) {
		callback(data.toString().trim());
	});
}

prompt('Please enter a URL to crawl...', function(input) {
	if (crawler.checkURL(input)) {
		crawler.crawl();
	} else {
		console.error('ERROR: URL provided is incorrect format. Please include protocol and domain.');
		process.exit();
	}
})