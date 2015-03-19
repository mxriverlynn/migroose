var AsyncSpec = require("node-jasmine-async");
var Migroose = require("../migroose");

xdescribe("migration steps", function(){

  describe("when running multiple steps", function(){
    var async = new AsyncSpec(this);

    var stepsRun;
    async.beforeEach(function(done){
      stepsRun = [];

      var migration = new Migroose.Migration();

      migration.step(function(data, stepComplete){
        setTimeout(function(){
          stepsRun.push(1);
          stepComplete();
        }, 50);
      });

      migration.step(function(data, stepComplete){
        setImmediate(function(){
          stepsRun.push(2);
          stepComplete();
        });
      });

      migration.step(function(data, stepComplete){
        setTimeout(function(){
          stepsRun.push(3);
          stepComplete();
        }, 10);
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
