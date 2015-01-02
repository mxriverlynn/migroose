var AsyncSpec = require("node-jasmine-async");
var Migroose = require("../migroose");
var manageConnection = require("./helpers/connection");
var dataModel = require("../migroose/dataModel");

describe("load collections", function(){
  manageConnection(this);
  var async = new AsyncSpec(this);

  var M1 = dataModel.get("somethings");
  var M2 = dataModel.get("querythings");

  async.beforeEach(function(done){
    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};
    var m3 = {foo: "quux"};

    M1.create({foo: "bar"}, function(err){
      if (err) { throw err; }

      M2.create(m1, m2, m3, function(err){
        if (err) { throw err; }

        done();
      });
    });
  });

  async.afterEach(function(done){
    M1.remove(function(err){
      M2.remove(function(err){
        done();
      })
    });
  });

  describe("when specifying a collection to load", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.load({
        things: "somethings"
      });

      migration.step(function(data, stepComplete){
        things = data.things;
        stepComplete();
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    it("should load the specified collection", function(){
      expect(things).not.toBeUndefined();
      expect(things.length).toBe(1);
      expect(things[0].get("foo")).toBe("bar");
    });
  });

  describe("when loading multiple collections", function(){
    var async = new AsyncSpec(this);
    var things, moreThings;

    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.load({
        things: "somethings",
        moreThings: "querythings"
      });

      migration.step(function(data, stepComplete){
        things = data.things;
        moreThings = data.moreThings;
        stepComplete();
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    it("should load the first collection", function(){
      expect(things).not.toBeUndefined();
      expect(things.length).toBe(1);
      expect(things[0].get("foo")).toBe("bar");
    });

    it("should load the second collection", function(){
      expect(moreThings).not.toBeUndefined();
      expect(moreThings.length).toBe(3);
    });
  });

  describe("when providing a query for the collection load", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.load({
        things: {
          collection: "querythings",
          query: {foo: "baz"}
        }
      });

      migration.step(function(data, stepComplete){
        things = data.things;
        stepComplete();
      });

      migration.migrate(function(err){
        if (err) { console.log(err.stack); }
        done();
      });
    });

    it("should load the collection using the specified query", function(){
      expect(things).not.toBeUndefined();
      expect(things.length).toBe(1);
      expect(things[0].get("foo")).toBe("baz");
    });
  });

});
