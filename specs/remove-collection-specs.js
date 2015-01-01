var AsyncSpec = require("node-jasmine-async");
var mongoose = require("mongoose");
var Mongrate = require("../mongrate");
var manageConnection = require("./helpers/connection");
var dataModel = require("../mongrate/dataModel");

describe("remove collections", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  var Model = dataModel.get("removethings");

  async.beforeEach(function(done){
    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};

    Model.create(m1, m2, function(err){
      if (err) { throw err; }
      done();
    });
  });

  describe("when specifying a collection to remove", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Mongrate.Migration();

      migration.remove({
        removeThings: "removethings"
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    async.it("should drop the specified collection", function(done){
      Model.find(function(err, models){
        if (err) { throw err; }
        expect(models.length).toBe(0);
        done();
      });
    });
  });

  describe("when specifying a collection to remove, with a query", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Mongrate.Migration();

      migration.remove({
        removeThings: {
          collection: "removethings",
          query: {foo: "baz"}
        }
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    async.it("should drop the specified collection", function(done){
      Model.find(function(err, models){
        if (err) { throw err; }
        expect(models.length).toBe(1);
        done();
      });
    });
  });

});
