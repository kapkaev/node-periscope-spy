var fs = require('fs');
var Twit = require('twit');
var peristream = require('peristream');

PERISCOPE_ID_REG = /periscope.tv\/w\/(.*)/i

function PeriscopeSpy(config) {
	this.T = new Twit(config);
  this.session = new Date().getTime();

}

PeriscopeSpy.prototype.follow = function(userId) {
  var stream = this.T.stream('statuses/filter', { track: 'periscope' })

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

  var log = function(name, msg) {
    console.log(name, msg);
    this.saveToFile(msg);
  }.bind(this)

  stream.connect().then(function(emitter){
    emitter.on(peristream.ALL, function(message){
      log('ALL', message)
    });

    emitter.on(peristream.HEARTS, function(message){
      log('HEARTS', message)
    });

    emitter.on(peristream.COMMENTS, function(message){
      log('COMMENTS', message)
    });

    emitter.on(peristream.DISCONNECT, function(message){
      log('DISCONNECT', message)
    });

    emitter.on(peristream.JOINED, function(message){
      log('JOINED', message)
    });

  });

};

PeriscopeSpy.prototype.saveToFile = function(message) {
  var data = JSON.stringify(message, null, 2)
  // events types
  // COMMENTS = 1;
  // HEARTS = 2;
  // JOINED = 3;
  fs.appendFile(this.session + ".json", data);
}

module.exports = PeriscopeSpy;
