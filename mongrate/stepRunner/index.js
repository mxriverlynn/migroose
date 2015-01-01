var RSVP = require("rsvp");

// StepRunner
// ----------

function StepRunner(){
  this.steps = [];
}

// Instance Methods
// ----------------

StepRunner.prototype.add = function(step){
  this.steps.push(step);
};

StepRunner.prototype.run = function(data, cb){
  var that = this;

  var promises = [];
  this.steps.forEach(function(step){
    var p = new RSVP.Promise(function(resolve, reject){

      var done = function(err){
        if (err) { 
          reject(err);
        } else {
          resolve();
        }
      };

      step.call(that, data, done);
    });

    promises.push(p);
  });

  RSVP.all(promises)
    .then(function(){
      cb(null);
    })
    .catch(function(err){
      cb(err);
    });
};

// Exports
// -------

module.exports = StepRunner;
