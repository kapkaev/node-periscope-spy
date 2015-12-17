var Formatter = require('../libs/data_formater'),
    Datastore = require('nedb'),
    Logger = require('../libs/logger'),
    dbFile = process.cwd() + '/db/event.db',
    db = new Datastore({ filename: dbFile, autoload: true });

function Event(data) {
  _.each(data, function(k,v){
    this[k] = v;
  }.bind(this));
}

Event.typeMapping = {
  "DISCONNECTED": "DISCONNECTED",
  "ALL": "ALL",
  1: "COMMENT",
  2: "HEART",
  3: "JOIN"
};

Event.insert = function(streamId, data){
  var formatter = new Formatter(streamId, data);
  var formattedData = formatter.format();

  db.insert(formattedData, function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
    if(err){
      Logger.error("Error:", err);
    } else {
      Logger.info("Inserted event, size: ", JSON.stringify(newDocs).length);
    }
  });
};

Event.prototype.findById = function(id) {
  db.find({ streamId: id }, function (err, docs) {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
    return _.map(docs, new Stream());
  });
};


Event.prototype.humanReadableType = function() {
  return Event.typeMapping[this.type];
};

module.exports = Event;
