var Formatter = require('../libs/data_formater'),
    _ = require('underscore-node'),
    Logger = require('../libs/logger'),
    DB = require('../db');

function Event(data) {
  _.each(data, function(k,v){
    this[k] = v;
  }.bind(this));
}

Event.typeMapping = {
  "DISCONNECTED": "DISCONNECTED",
  "ALL": "ALL",
  1: "comment",
  2: "heart",
  3: "join"
};

Event.insert = function(streamId, data){
  var formatter = new Formatter(streamId, data);
  var formattedData = formatter.format();

  DB.event.insert(formattedData, function (err, newDocs) {
    Event.updateRelated(newDocs);
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id
    if(err){
      Logger.error("Error:", err);
    } else {
      Logger.info("Inserted event, size: ", JSON.stringify(newDocs).length);
    }
  });
};

Event.updateRelated = function(rec){
  var eventType = Event.typeMapping[rec.type]
  var data = {
    comment: 0,
    join: 0,
    heart: 0
  }
  data[eventType] += 1

  if (data[eventType]){
    DB.broadcast.update({ streamId: rec.streamId }, { $inc: data });
  }
}


Event.prototype.findById = function(id) {
  DB.event.find({ streamId: id }, function (err, docs) {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
    return _.map(docs, new Stream());
  });
};


Event.prototype.humanReadableType = function() {
  return Event.typeMapping[this.type];
};

module.exports = Event;
