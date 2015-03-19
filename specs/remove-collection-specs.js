var AsyncSpec = require("node-jasmine-async");

var DataLoader = require("../migroose/dataLoader");
var Migroose = require("../migroose");
var manageConnection = require("./helpers/connection");

describe("remove documents from collection", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  var removeThings;

  async.beforeEach(function(done){
    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};

    var dataLoader = new DataLoader({
      removeThings: "removethings"
    });

    dataLoader.load(function(err, data){
      if (err) { throw err; }

      removeThings = data.removeThings.collection;
      removeThings.insert([m1, m2], function(err){
        if (err) { throw err; }
        done();
      });
    });
  });

  describe("when specifying a collection to remove", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.remove({
        removeThings: "removethings"
      });

      migration.migrate(function(err){
        if (err) { throw err; }
        done();
      });
    });

    async.it("should drop the specified collection", function(done){
      removeThings.find().toArray(function(err, models){
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
      var migration = new Migroose.Migration();

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
      removeThings.find().toArray(function(err, models){
        if (err) { throw err; }
        expect(models.length).toBe(1);
        done();
      });
    });
  });

});
