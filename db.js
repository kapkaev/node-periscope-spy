var Datastore = require('nedb');

function DB(){
}

DB.broadcast = new Datastore({ filename: process.cwd() + '/db/broadcast.db', autoload: true });
DB.event     = new Datastore({ filename: process.cwd() + '/db/event.db', autoload: true });

DB.broadcast.persistence.setAutocompactionInterval(60 * 1000)

module.exports = DB;
