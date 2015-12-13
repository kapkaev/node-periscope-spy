var fs = require('fs'),
    winston = require('winston');

function dir(){
  var dir =  process.cwd() + '/logs'
  !fs.existsSync(dir) ? fs.mkdirSync(dir) : dir

  return dir;
}

Logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
      name: 'info',
      filename: dir() + '/current.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error',
      filename: dir() + '/error.log',
      level: 'error'
    })
  ]
});

module.exports = Logger;
