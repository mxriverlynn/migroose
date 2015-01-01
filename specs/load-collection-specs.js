var AsyncSpec = require("node-jasmine-async");
var Mongrate = require("../mongrate");
var manageConnection = require("./helpers/connection");

describe("load collections", function(){
  manageConnection(this);

  describe("when specifying a collection to load", function(){
    var async = new AsyncSpec(this);
    var things;

    async.beforeEach(function(done){
      var migration = new Mongrate.Migration();

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
      var migration = new Mongrate.Migration();

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
      var migration = new Mongrate.Migration();

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
