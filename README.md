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

**Rebuild documentation**

    grunt doc

**Servve**

    grunt run
  
## Maintenance

**Latest known working versions**

    > node --version
    v22.14.0

    > npm --version
    10.9.0

    > grunt --version
    grunt-cli v1.5.0
    grunt v1.6.1

### Check-up

    npm audit
    npm audit fix

#### Check for new versions

    sudo npm install -g npm-check
    npm-check
