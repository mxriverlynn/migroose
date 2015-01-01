var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RSVP = require("rsvp");

var DataLoader = require("./dataLoader");
var DataRemover = require("./dataRemover");
var StepRunner = require("./stepRunner");
var MigrationModel = require("./migrationModel");

// Migration
// ---------

function Migration(migrationId, description){
  this.migrationId = migrationId;
  this.description = description;
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

  function runMigration(){
    dataLoader.load(function(err, data){
      if (err) { return cb(err); }

      stepRunner.run(data, function(err){
        if (err) { return cb(err); }

        dataRemover.remove(function(err){
          if (err) { return cb(err); }

          that.save(function(err){
            if (err) { return cb(err); }

            that.emit("complete");
          });
        });
      });
    });
  }

  if (this.migrationId){
    MigrationModel.findOne({migrationId: this.migrationId}, function(err, model){
      if (err) { return cb(err); }

      if (model){
        that.emit("already-run");
      } else {
        runMigration();
      }
    });
  } else {
    runMigration();
  }

};

Migration.prototype.save = function(cb){
  if (!this.migrationId){ return cb(); }

  var model = new MigrationModel({
    migrationId: this.migrationId,
    description: this.description,
    migrationDate: Date.now()
  });

  model.save(cb);
};

// Exports
// -------

module.exports = Migration;
