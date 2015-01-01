var AsyncSpec = require("node-jasmine-async");
var mongoose = require("mongoose");
var Mongrate = require("../mongrate");
var manageConnection = require("./helpers/connection");
var dataModel = require("../mongrate/dataModel");

describe("migration ids", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  var migrationId = "some-id";

  describe("when running a migration with an id", function(){
    var async = new AsyncSpec(this);

    async.beforeEach(function(done){
      var migration = new Mongrate.Migration(migrationId);

      migration.on("complete", function(){
        done();
      });

      migration.migrate(function(err){
        console.log(err.stack);
      });
    });

    async.it("should store the migration id as having been run", function(done){
      throw new Error("not implemented");
    });
  });

  describe("when running a migration with an id, twice", function(){
    var async = new AsyncSpec(this);

    async.beforeEach(function(done){
      var migration = new Mongrate.Migration(migrationId);

      migration.on("complete", function(){
        done();
      });

      migration.migrate(function(err){
        console.log(err.stack);
      });
    });

    async.it("should only run once", function(done){
      throw new Error("not implemented");
    });
  });

});
