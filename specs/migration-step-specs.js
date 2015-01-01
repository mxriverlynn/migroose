var AsyncSpec = require("node-jasmine-async");
var Mongrate = require("../mongrate");

describe("migration steps", function(){

  describe("when running multiple steps", function(){
    var async = new AsyncSpec(this);

    var stepsRun;
    async.beforeEach(function(done){
      stepsRun = [];

      var migration = new Mongrate.Migration();

      migration.step(function(data, stepComplete){
        stepsRun.push(1);
        stepComplete();
      });

      migration.step(function(data, stepComplete){
        stepsRun.push(2);
        stepComplete();
      });

      migration.step(function(data, stepComplete){
        stepsRun.push(3);
        stepComplete();
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    it("should run them in order", function(){
      expect(stepsRun.length).toBe(3);
      expect(stepsRun[0]).toBe(1);
      expect(stepsRun[1]).toBe(2);
      expect(stepsRun[2]).toBe(3);
    });

  });

});
