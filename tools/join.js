var fs = require('fs');

class Joiner {
  join() {
    this.readJSON('info/core_js.json').then(files => {
      this.joinFiles(files, 'bin/joined.js');
      this.buildScriptDev(files);
      this.getAllScripts(files).then((files) => {
        this.joinFiles(files, 'bin/all.js');
      });
    });
    this.readJSON('info/core_css.json').then((files) => {
      this.joinFiles(files, 'bin/joined.css');
      this.buildCSSDev(files);
    });
  }
  
  getAllScripts(existing) {
    return new Promise((accept,reject) => {
      fs.readdir('js/',(error, files) => {
        if (error) {
          reject(error);
        } else {
          const all = [].concat(existing)
          files.filter(f => f.endsWith('.js')).map(f => `js/${f}`).forEach(f => {
            if (!all.includes(f)) {
              all.push(f);
            }
          })
          accept(all);
        }
      })
    });
  }

  joinFiles(data, target) {
    fs.truncateSync(target)
    const stream = fs.createWriteStream(target, { flags: 'a' });
    data.forEach((file) => {
      const str = fs.readFileSync( file );
      stream.write(str);
      stream.write("\n\n");
    })
    stream.end()
  }

  buildScriptDev(data) {
    const file = 'bin/development.js'
    fs.truncateSync(file)
    const stream = fs.createWriteStream(file, { flags: 'a' });
    stream.write(`(function() {
  _context = (function() {
    var scripts = document.getElementsByTagName('script');
    var find = 'bin/development.js'
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (!src) continue
      var idx = src.indexOf(find)
      if (idx !== -1) {
        return src.substring(0, idx).replace(/\\/+$/,'');
      }
    }
  })();

`)
    data.forEach((file) => {
      stream.write('  document.write(\'<script type="text/javascript" src="\'+_context+\'/' + file + '"></script>\');');
      stream.write("\n");
    })
    stream.write(`})()`);
    stream.end()
  }

  buildCSSDev(data) {
    const file = 'bin/development.css'
    fs.truncateSync(file)
    const stream = fs.createWriteStream(file, { flags: 'a' });
    data.forEach((file) => {
      stream.write('@import url(../' + file + ');');
      stream.write("\n");
    })
    stream.end()
  }

  readJSON(path) {

    var self = this;
    return new Promise((resolve, reject) =>{
      fs.readFile( path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    })
  }
}

new Joiner().join();