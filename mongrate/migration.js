var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RSVP = require("rsvp");

var DataLoader = require("./dataLoader");
var DataRemover = require("./dataRemover");
var StepRunner = require("./stepRunner");

// Migration
// ---------

function Migration(){
  this.stepRunner = new StepRunner();
}

util.inherits(Migration, EventEmitter);

// Instance Methods
// ----------------

Migration.prototype.load = function(loadConfig){
  this.loadConfig = loadConfig;
};

Migration.prototype.step = function(step){
  this.stepRunner.add(step);
};

Migration.prototype.remove = function(removeConfig){
  this.removeConfig = removeConfig;
};

Migration.prototype.migrate = function(cb){
  var that = this;

  var stepRunner = this.stepRunner;
  var dataLoader = new DataLoader(this.loadConfig);
  var dataRemover = new DataRemover(this.removeConfig);

  dataLoader.load(function(err, data){
    if (err) { return cb(err); }

    stepRunner.run(data, function(err){
      if (err) { return cb(err); }

      dataRemover.remove(function(err){
        if (err) { return cb(err); }

        that.emit("complete");
      });
    });
  });
};

// Exports
// -------

module.exports = Migration;
