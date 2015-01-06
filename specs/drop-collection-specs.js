var _ = require("underscore");
var AsyncSpec = require("node-jasmine-async");
var mongoose = require("mongoose");

var Migroose = require("../migroose");
var manageConnection = require("./helpers/connection");
var dataModel = require("../migroose/dataModel");

describe("drop collections", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  var Model = dataModel.get("dropthings");

  async.beforeEach(function(done){
    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};

    Model.create(m1, m2, function(err){
      if (err) { throw err; }
      done();
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

});
