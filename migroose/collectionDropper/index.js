var RSVP = require("rsvp");
var _ = require("underscore");
var mongoose = require("mongoose");

// Collection Dropper
// ------------------

function CollectionDropper(collectionsToDrop){
  this.collectionsToDrop = collectionsToDrop;
}

// Instance Methods
// ----------------

CollectionDropper.prototype.drop = function(cb){
  var that = this;
  var promises = [];
  var collectionsToDrop = [];
  
  if (_.isArray(this.collectionsToDrop)){
    collectionsToDrop = collectionsToDrop.concat(this.collectionsToDrop);
  }

  collectionsToDrop.forEach(function(collectionName){
    var promise = that.dropCollection(collectionName);
    promises.push(promise);
  });

  RSVP.all(promises)
    .then(function(data){
      cb(undefined);
    })
    .catch(function(err){
      cb(err);
    });
};

CollectionDropper.prototype.dropCollection = function(collectionName){
  var that = this;

  var p = new RSVP.Promise(function(resolve, reject){

    that._hasCollection(collectionName, function(err, hasCollection) {
      if (err) { return reject(err); }
        
      if (!hasCollection) { return resolve(); }

      that._dropCollection(collectionName, function(err) {
        if (err) { return reject(err); }
        resolve();
      });
    });
  });

  return p;
};

CollectionDropper.prototype._hasCollection = function(collectionName, cb){
  var query = {
    name: collectionName
  };

  mongoose.connection.db.listCollections(query).toArray(function(err, collections){
    if (err) { return cb(err); }
    var hasCollection = (collections.length === 1);
    cb(null, hasCollection);
  });
};

CollectionDropper.prototype._dropCollection = function(collectionName, cb){
  mongoose.connection.db.collection(collectionName, function(err, collection){
    if (err) { return cb(err); }

    if (!collection){
      return cb();
    }

    collection.drop(function(err){
      if (err) { return cb(err); }
      return cb();
    });
  });
};

// Exports
// -------

module.exports = CollectionDropper;
