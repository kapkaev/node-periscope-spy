var Formatter = require('../libs/data_formater'),
    Logger = require('../libs/logger'),
    Datastore = require('nedb'),
    dbFile = process.cwd() + '/db/streams.db',
    db = new Datastore({ filename: dbFile, autoload: true });

function Stream(data) {
  _.each(data, function(k,v){
    this[k] = v;
  }.bind(this));
}

Stream.typeMapping = {
  "DISCONNECTED": "DISCONNECTED",
  "ALL": "ALL",
  1: "COMMENT",
  2: "HEART",
  3: "JOIN"
};

Stream.insert = function(streamId, data){
  var formatter = new Formatter(streamId, data);
  var formattedData = formatter.format();

  db.insert(formattedData, function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
    if(err){
      Logger.error("Error:", err);
    } else {
      Logger.info("Inserted record, size: ", JSON.stringify(newDocs).length);
    }
  });
};

Stream.prototype.findById = function(id) {
  db.find({ streamId: id }, function (err, docs) {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
    return _.map(docs, new Stream());
  });
};


Stream.prototype.humanReadableType = function() {
  return Stream.typeMapping[this.type];
};

module.exports = Stream;
