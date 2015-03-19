var AsyncSpec = require("node-jasmine-async");
var mongoose = require("mongoose");
var _ = require("underscore");

var Migroose = require("../migroose");
var DataLoader = require("../migroose/dataLoader");
var manageConnection = require("./helpers/connection");

describe("drop collections", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  async.beforeEach(function(done){
    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};

    var dataLoader = new DataLoader({
      dropThings: "dropthings"
    });

    dataLoader.load(function(err, data){
      data.dropThings.collection.insert([m1, m2], function(err){
        if (err) { throw err; }
        done();
      });
    });
  });

  describe("when specifying a collection to drop", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.drop("dropthings");

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    async.it("should drop the specified collection", function(done){
      var dbName = mongoose.connection.db.databaseName;
      var dropThingsName = dbName + ".dropthings";

      mongoose.connection.db.collectionNames(function(err, collections){
        var hasDropThings = false;
        collections.forEach(function(col){
          if (col.name === dropThingsName) {
            hasDropThings = true;
          }
        });

        expect(hasDropThings).toBe(false);
        done();
      });
    });
  });

  describe("when trying to drop a collection that doesn't exist", function(){
    var async = new AsyncSpec(this);
    var things;

    var err; 
    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.drop("i-dont-exist");

      migration.migrate(function(e){
        err = e;
        if (err) { console.log(err.stack); }
        done();
      });
    });

    async.it("should not throw an error", function(done){
      expect(err).toBe(undefined);
      done();
    });
  });

});
