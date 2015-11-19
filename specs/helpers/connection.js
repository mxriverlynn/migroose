var mongoose = require("mongoose");
var config = require("./config.json");

module.exports = function(jasmine){

  beforeEach(function(done){
    mongoose.connect(config.mongodb, function(){
      done();
    });
  });

  afterEach(function(done){
    mongoose.disconnect(function(){
      done();
    });
  });
}
