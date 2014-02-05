
build: web/build.js web/build.css
	@#nothing

web/build.js: index.js lib
	browserify index.js -s macatapa > web/build.js

web/build.css: index.less less
	lessc index.less > web/build.css

test: lint test-only

lint:
	jshint --verbose *.js lib test

test-only:
	mocha -R spec

