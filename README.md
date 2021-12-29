# Humansie User Interface

A library for web user interfaces developed by [Humanise](https://www.humanise.dk)

## Development

**Watch for changes**

	grunt

**Build everything**

	grunt build

**Run all unit tests**

	grunt test

**Run a single unit tests**

	grunt test:color

**Compile front page**

	xsltproc index.xml > index.html

**Robuild documentation**

	grunt doc
  
## Maintenance

**Latest known working versions**

	> node --version
	v16.13.1

	> npm --version
	8.3.0

	> grunt --version
	grunt-cli v1.4.3
	grunt v1.4.1

### Check-up

	npm audit
	npm audit fix

#### Check for new versions

	sudo npm install -g npm-check
	npm-check
