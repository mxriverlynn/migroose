var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RSVP = require("rsvp");

var DataLoader = require("./dataLoader");
var StepRunner = require("./stepRunner");

// Migration
// ---------

function Migration(){
  this.stepRunner = new StepRunner();
}

util.inherits(Migration, EventEmitter);

// Instance Methods
// ----------------

Migration.prototype.load = function(collectionConfig){
  this.collectionConfig = collectionConfig;
};

Migration.prototype.step = function(step){
  this.stepRunner.add(step);
};

Migration.prototype.migrate = function(){
  var that = this;

  var dataLoader = new DataLoader(this.collectionConfig);
  dataLoader.load(function(err, data){
    if (err) { throw err; }

    that.stepRunner.run(data, function(err){
      if (err) { throw err; }

      that.emit("complete");
    });
  });
};

// Exports
// -------

module.exports = Migration;
