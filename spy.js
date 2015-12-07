var Twit = require('twit');
var periscope = require('node-periscope-stream');
var peristream = require('peristream');

function PeriscopeSpy(config) {
	this.T = new Twit(config);

  this.getUserId = function(userName) {
    this.getUserData(userName).id;
  }

  this.getUserData = function (userName) {
    this.T.get('users/lookup', { screen_name: userName }, function(err, data, response) {
      if(err) {
        console.log(err);
        return {};
      }
      return data;
    });
  }

}

PeriscopeSpy.prototype.follow = function(userName) {
  var userId = this.getUserId(userName);
	var stream = this.T.stream('statuses/filter', { follow: [userId] });

	stream.on('tweet', function (tweet) {
		if (!tweet.entities.urls || !tweet.entities.urls.length) {
			return;
		}

		var periscopeUrl = tweet.entities.urls[0].expanded_url;

		periscope(periscopeUrl, function(err, info) {
			if (err) {
				console.log(err);
				return;
			}

      console.log(info)
		});
	});
};

module.exports = PeriscopeSpy;
