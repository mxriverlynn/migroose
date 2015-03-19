var RSVP = require("rsvp");

// StepRunner
// ----------

function StepRunner(){
  this.steps = [];
  this.data = {};
}

// Instance Methods
// ----------------

StepRunner.prototype.add = function(step){
  this.steps.push(step);
};

StepRunner.prototype.run = function(done){
  var that = this;
  function runStep(steps, done){
    if (steps.length === 0) {
      return done();
    }

    var step = steps.shift();

    function next(){
      setImmediate(function(){
        runStep(steps, done);
      });
    }

    step(that.data, function(err){
      if (err) { return done(err); }
      return next();
    });
  }

  runStep(this.steps, done);
};

StepRunner.prototype.storeData = function(newData){
  var data = this.data;
  Object.keys(newData).forEach(function(key){
    data[key] = newData[key];
  });
};

// Exports
// -------

module.exports = StepRunner;
