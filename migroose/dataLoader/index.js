var RSVP = require("rsvp");
var _ = require("underscore");

var dataModel = require("../dataModel");

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
      var promise = that.loadCollection(name, config);
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

DataLoader.prototype.loadCollection = function(name, collectionConfig){
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

    collection.find(query, function(err, data){
      if (err) { return reject(err); }

      var result = {};
      result[name] = data;

      resolve(result);
    });
  });

  return p;
};

// Helpers
// -------

function arrayToObject(arr){
  var args = [{}].concat(arr);
  return _.extend.apply(_, args);
}

// Exports
// -------

module.exports = DataLoader;
