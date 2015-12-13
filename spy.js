var fs = require('fs'),
    Twit = require('twit'),
    peristream = require('peristream'),
    Stream = require('./models/stream');

PERISCOPE_ID_REG = /periscope.tv\/w\/(.*)/i

function PeriscopeSpy(config) {
  PeriscopeSpy.bootstrap();

	this.T = new Twit(config);
  this.session = new Date().getTime();
}

PeriscopeSpy.bootstrap = function(){
  // create directory for db
  var dir =  process.cwd() + '/db'
  !fs.existsSync(dir) ? fs.mkdirSync(dir) : dir
};

PeriscopeSpy.prototype.follow = function(userId) {
  //var stream = this.T.stream('statuses/filter', { follow: userId })
  var stream = this.T.stream('statuses/filter', { track: 'periscope' });

  stream.on('tweet', function (tweet) {
    if (!tweet.entities.urls || !tweet.entities.urls.length) {
      return;
    }

    var url = tweet.entities.urls[0].expanded_url;

    // skip non periscope links
    if (!url.match(PERISCOPE_ID_REG)){
      return;
    }

    var streamId = url.match(PERISCOPE_ID_REG)[1];

    this.subscribeToStream(streamId);
  }.bind(this));

  var log = function(name, msg) {
    console.log("name: " + name);
    if (name == 'error'){
      console.log(msg);
    }
  }

  stream.on('limit', function (limitMessage) {
    log('limit', limitMessage);
  })

  stream.on('error', function (eventMsg) {
    log('error', eventMsg);
  })
};


PeriscopeSpy.prototype.subscribeToStream = function(streamId){
  var stream = peristream(streamId);

  var track = function(name, msg) {
    this.saveToDb(streamId, msg);
  }.bind(this)

  stream.connect().then(function(emitter){
    emitter.on(peristream.ALL, function(message){
      track('ALL', message)
    });

    emitter.on(peristream.HEARTS, function(message){
      track('HEARTS', message)
    });

    emitter.on(peristream.COMMENTS, function(message){
      track('COMMENTS', message)
    });

    emitter.on(peristream.DISCONNECT, function(message){
      track('DISCONNECT', message)
    });

    emitter.on(peristream.JOINED, function(message){
      track('JOINED', message)
    });

  });

};

PeriscopeSpy.prototype.saveToDb = function(streamId, message) {
  Stream.insert(streamId, message);
  // events types
  //DISCONNECTED = 'DISCONNECTED';
  //ALL = 'ALL';
  //COMMENTS = 1;
  //HEARTS = 2;
  //JOINED = 3;
}

module.exports = PeriscopeSpy;

