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

StepRunner.prototype.run = function(data, done){
  var that = this;

  function runStep(steps, data, done){
    if (steps.length === 0) {
      return done();
    }

    var step = steps.shift();

    function next(){
      setImmediate(function(){
        runStep(steps, data, done);
      });
    }

    step(data, function(err){
      if (err) { return done(err); }
      return next();
    });
  }

  runStep(this.steps, data, done);
};

// Exports
// -------

module.exports = StepRunner;
