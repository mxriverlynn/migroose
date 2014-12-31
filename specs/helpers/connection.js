var mongoose = require("mongoose");
var AsyncSpec = require("node-jasmine-async");
var config = require("./config.json");

module.exports = function(jasmine){
  var async = new AsyncSpec(jasmine);

  async.beforeEach(function(done){
    mongoose.connect(config.mongodb, function(){
      done();
    });
  });

  async.afterEach(function(done){
    mongoose.disconnect(function(){
      done();
    });
  });
}
