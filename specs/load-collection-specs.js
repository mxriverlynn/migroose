var Migroose = require("../migroose");
var DataLoader = require("../migroose/dataLoader");
var manageConnection = require("./helpers/connection");

describe("load collections", function(){
  manageConnection(this);

  var dataLoader, someThings, queryThings;

  beforeEach(function(done){
    dataLoader = new DataLoader({
      someThings: "somethings",
      queryThings: "querythings"
    });

    var m1 = {foo: "bar"};
    var m2 = {foo: "baz"};
    var m3 = {foo: "quux"};

    dataLoader.load(function(err, data){
      if (err) { throw err; }

      someThings = data.someThings.collection;
      queryThings = data.queryThings.collection;

      someThings.insert(m1, function(err){
        if (err) { throw err; }

        queryThings.insert([m1, m2, m3], function(err){
          if (err) { throw err; }

          done();
        });
      });
    });
  });

  afterEach(function(done){
    someThings.remove(function(err){
      queryThings.remove(function(err){
        done();
      })
    });
  });

  describe("when specifying a collection to load", function(){
    var things;

    beforeEach(function(done){
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
      var collection = things.collection;
      expect(collection).not.toBeUndefined();
      expect(collection.collectionName).toBe("somethings");
    });

    it("should load the data from that collection", function(){
      var documents = things.documents;
      expect(documents).not.toBeUndefined();
      expect(documents.length).toBe(1);
      expect(documents[0].foo).toBe("bar");
    });
  });

  describe("when loading multiple collections", function(){
    var things, moreThings;

    beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.load({
        things: "somethings",
        moreThings: "querythings"
      });

      migration.step(function(data, stepComplete){
        things = data.things.documents;
        moreThings = data.moreThings.documents;
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
      expect(things[0].foo).toBe("bar");
    });

    it("should load the second collection", function(){
      expect(moreThings).not.toBeUndefined();
      expect(moreThings.length).toBe(3);
    });
  });

  describe("when providing a query for the collection load", function(){
    var things;

    beforeEach(function(done){
      var migration = new Migroose.Migration();

      migration.load({
        things: {
          collection: "querythings",
          query: {foo: "baz"}
        }
      });

      migration.step(function(data, stepComplete){
        things = data.things.documents;
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
      expect(things[0].foo).toBe("baz");
    });
  });

});
