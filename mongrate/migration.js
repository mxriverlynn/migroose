var util = require("util");
var EventEmitter = require("events").EventEmitter;
var RSVP = require("rsvp");
var _ = require("underscore");

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

  var hasId = this._hasMigrationId();
  // always run if there is no migration id set
  if (!hasId){
    return this._runMigration(cb);
  }

  // if there is a migration id set, then only run if it has
  // not previously been run for this app
  MigrationModel.findOne({migrationId: this.migrationId}, function(err, model){
    if (err) { return that._complete(err, cb); }

    if (model){
      that._alreadyRun(cb);
    } else {
      that._runMigration(cb);
    }
  });
};

// Private Helpers
// ---------------

Migration.prototype._hasMigrationId = function(){
  var hasId = Object.prototype.hasOwnProperty.call(this, "migrationId");
  var hasValue = !!this.migrationId;
  return hasId && hasValue;
};

Migration.prototype._runMigration = function(cb){
  var that = this;
  var stepRunner = this.stepRunner;
  var dataLoader = new DataLoader(this.loadConfig);
  var dataRemover = new DataRemover(this.removeConfig);

  dataLoader.load(function(err, data){
    if (err) { return that._complete(err, cb); }

    stepRunner.run(data, function(err){
      if (err) { return that._complete(err, cb); }

      dataRemover.remove(function(err){
        if (err) { return that._complete(err, cb); }

        that._save(function(err){
          if (err) { return that._complete(err, cb); }

          that._complete(null, cb);
        });
      });
    });
  });
};

Migration.prototype._alreadyRun = function(cb){
  this.emit("already-run");
  this._complete(null, cb);
};

Migration.prototype._complete = function(err, cb){
  if (err) {
    this.emit("error", err);
  }

  this.emit("complete", err);

  if (_.isFunction(cb)){
    cb(err);
  }
};

Migration.prototype._save = function(cb){
  var hasId = this._hasMigrationId();
  if (!hasId){ return cb(); }

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
