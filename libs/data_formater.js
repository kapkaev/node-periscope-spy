var _ = require('underscore-node');

function DataFormatter(streamId, data){
  this.data = data;
  this.streamId = streamId;
}

DataFormatter.prototype.format = function() {
  if (_.isArray(this.data)){
    return _.map(this.data, this.base)
  } else {
    return this.base(this.data);
  }
};

DataFormatter.prototype.base = function(record) {
  var defaultKeys = ['username', 'displayName', 'timestamp', 'profileImageURL', 'type', 'body'];
  var data = _.pick(record, defaultKeys);
  return _.extend({}, {streamId: this.streamId}, data);
};

module.exports = DataFormatter;
