var mongoose = require("mongoose");

var Migroose = require("../migroose");
var manageConnection = require("./helpers/connection");

describe("migration ids", function(){
  manageConnection(this);

  beforeEach(function(done){
    Migroose.MigrationModel.remove(function(err){
      done();
    });
  });

  describe("when running a migration with an id", function(){
    var migrationId = "some-id";
    var migrationDescription = "some description of a migration";

    beforeEach(function(done){
      var migration = new Migroose.Migration(migrationId, migrationDescription);

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    it("should store the migration, saying it has been run", function(done){
      Migroose.MigrationModel.findOne({migrationId: migrationId}, function(err, migrationModel){
        if (err) { console.log(err.stack); throw err; }
        expect(migrationModel).not.toBeUndefined();
        expect(migrationModel.migrationId).toBe(migrationId);
        expect(migrationModel.description).toBe(migrationDescription);
        expect(migrationModel.dateMigrated).not.toBe(undefined);
        done();
      });
    });
  });

  describe("when running a migration with an id multiple times", function(){

    var executeCount = 0;
    var alreadyRun = false;

    beforeEach(function(done){
      var migration = new Migroose.Migration("another-id");

      migration.step(function(data, stepComplete){
        executeCount += 1;
        stepComplete();
      });

      migration.on("already-run", function(){
        alreadyRun = true;
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        
        migration.migrate(function(){
          done();
        });
      });
    });

    it("should only execute once", function(){
      expect(executeCount).toBe(1);
    });

    it("should by already run", function(){
      expect(alreadyRun).toBe(true);
    });
  });

});
