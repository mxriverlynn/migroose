var mongoose = require("mongoose");
var Registry = require("./registry");

// Data Model Cache
// ----------------

var dataModelCache = new Registry();

// Public API
// ----------

var DataModel = {
  get: function(collectionName){
    var collection;

    if (dataModelCache.hasValue(collectionName)){
      collection = dataModelCache.getValue(collectionName);
    } else {
      collection = mongoose.model(collectionName, mongoose.Schema({}, {strict: false}));
      dataModelCache.register(collectionName, collection);
    }

    return collection;
  }
};

// Exports
// -------

module.exports = DataModel;
