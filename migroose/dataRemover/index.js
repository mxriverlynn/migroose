var RSVP = require("rsvp");
var _ = require("underscore");
var mongoose = require("mongoose");

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

  return _executeQuery(collectionName, query);
};

// Helpers
// -------

function _executeQuery(collectionName, query){
  return new RSVP.Promise(function(resolve, reject){

    mongoose.connection.db.collection(collectionName, function(err, collection){
      if (err) { return reject(err); }

      collection.remove(query, function(err, data){
        if (err) { return reject(err); }
        resolve();
      });
    });

  });
}

// Exports
// -------

module.exports = DataRemover;
