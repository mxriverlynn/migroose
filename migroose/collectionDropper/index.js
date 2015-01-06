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
  var collectionsToDrop = [].concat(this.collectionsToDrop);

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
    var collections = _.keys(mongoose.connection.collections);

    var collection = mongoose.connection.collections[collectionName];
    var hasCollection = (!!collection);

    if (hasCollection){
      collection.drop(function(err) {
        if (err) { reject(err); }
        resolve();
      });
    } else {
      resolve();
    }
  });

  return p;
};

// Exports
// -------

module.exports = CollectionDropper;
