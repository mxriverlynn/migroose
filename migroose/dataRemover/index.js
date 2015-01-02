var RSVP = require("rsvp");
var _ = require("underscore");

var dataModel = require("../dataModel");

// Data Remover
// ------------

function DataRemover(collectionConfig){
  this.collectionConfig = collectionConfig;
}

// Instance Methods
// ----------------

DataRemover.prototype.remove = function(cb){
  var that = this;
  var promises = [];

  for (var name in this.collectionConfig) {
    if (this.collectionConfig.hasOwnProperty(name)){
      var config = this.collectionConfig[name];
      var promise = that.removeCollection(name, config);
      promises.push(promise);
    }
  }

  RSVP.all(promises)
    .then(function(data){
      cb(undefined);
    })
    .catch(function(err){
      cb(err);
    });
};

DataRemover.prototype.removeCollection = function(name, collectionConfig){
  var that = this;
  var collectionName, query;

  if (_.isObject(collectionConfig)){
    query = collectionConfig.query;
    collectionName = collectionConfig.collection;
  } else {
    query = {};
    collectionName = collectionConfig;
  }

  var p = new RSVP.Promise(function(resolve, reject){
    var collection = dataModel.get(collectionName);

    collection.remove(query, function(err, data){
      if (err) { return reject(err); }

      resolve();
    });
  });

  return p;
};

// Exports
// -------

module.exports = DataRemover;
