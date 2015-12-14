var cheerio = require('cheerio');
var request = require('request');

function informationFetcher(shortUrl, streamId){
  this.url = shortUrl;
  this.streamId = streamId;
}

informationFetcher.prototype.fetch = function() {
  var scope = this;
  return informationFetcher._get(this.url).then(function(body){
    return scope._parse_data(body)
  });
};

informationFetcher.prototype._parse_data = function(body) {
  var $html = cheerio.load(body);
  var url = $html('link[rel="canonical"]').attr('href');
  return {
    url: url,
    streamId: this.streamId
  };
};

informationFetcher._get = function(url) {
  return new Promise(function (resolve, reject) {
    request.get(url, function (err, res, body) {
      return resolve(body);
    });
  })
};

module.exports = informationFetcher;




