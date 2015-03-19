var RSVP = require("rsvp");
var mongoose = require("mongoose");
var _ = require("underscore");

// Data Loader
// -----------

function DataLoader(collectionConfig){
  this.collectionConfig = collectionConfig || {};
}

// Instance Methods
// ----------------

DataLoader.prototype.load = function(cb){
  var that = this;
  var promises = [];

  for (var name in this.collectionConfig) {
    if (this.collectionConfig.hasOwnProperty(name)){
      var config = this.collectionConfig[name];
      var promise = that._loadCollection(name, config);
      promises.push(promise);
    }
  }

  RSVP.all(promises)
    .then(function(data){
      var result = arrayToObject(data);
      cb(undefined, result);
    })
    .catch(function(err){
      cb(err);
    });
};

// private API
// -----------

DataLoader.prototype._loadCollection = function(name, collectionConfig){
  var that = this;
  var collectionName, query;

  if (_.isObject(collectionConfig)){
    query = collectionConfig.query;
    collectionName = collectionConfig.collection;
  } else {
    query = {};
    collectionName = collectionConfig;
  }

  return _executeQuery(name, collectionName, query);
};

// Helpers
// -------

function _executeQuery(name, collectionName, query){
  return new RSVP.Promise(function(resolve, reject){

    mongoose.connection.db.collection(collectionName, function(err, collection){
      collection.find(query).toArray(function(err, documents){
        if (err) { return reject(err); }

        var result = {};
        var data = {
          documents: documents,
          collection: collection
        };
        result[name] = data;

        resolve(result);
      });
    });

  });
}

function arrayToObject(arr){
  var args = [{}].concat(arr);
  return _.extend.apply(_, args);
}

// Exports
// -------

module.exports = DataLoader;
