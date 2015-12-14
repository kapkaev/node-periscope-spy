var Formatter = require('../libs/information_fetcher'),
    Datastore = require('nedb'),
    Logger = require('../libs/logger'),
    dbFile = process.cwd() + '/db/Broadcast.db',
    db = new Datastore({ filename: dbFile, autoload: true });

function Broadcast(data) {
  _.each(data, function(k,v){
    this[k] = v;
  }.bind(this));
}

Broadcast.insert = function(streamId, shortUrl){
  var formatter = new Formatter(shortUrl, streamId);
  formatter.fetch().then(function(data){
    db.insert(data, function (err, newDocs) {
      // Two documents were inserted in the database
      // newDocs is an array with these documents, augmented with their _id
      if(err){
        Logger.error("Error:", err);
      } else {
        Logger.info("Inserted broadcast info with url: "+shortUrl);
      }
    });
  });
};

Broadcast.prototype.findById = function(id) {
  db.find({ streamId: id }, function (err, docs) {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
    return _.map(docs, new Broadcast());
  });
};


module.exports = Broadcast;

