# Mongrate: MongoDB Migrations

Mongrate provides database / data-structure migrations for MongoDB, with NodeJS and MongooseJS 
models / schemas.

Changing your document structure in MongoDB is no different than changing a table structure
in a relational database, when it comes to migrating data. The migration needs to be done - 
you need your new data structure to be populated with the data from the old structure.

Mongrate will help you get there by providing a structure and framework in which you can
migrate from your old MongoDB collections and document structures, in to your new one.

## Getting Started

Start by installing mongrate in your project:

```
npm install --save mongrate
npm install -g mongrate-cli
```

### Create A Migration Script

To create a migration, you will want to use [mongrate-cli](/derickbailey/mongrate-cli).
This is a command line tool to generate and run you migrations.

```
mongrate some example migration
```

This will create a `mongrations/########-some-example-migration.js` file
where "########" is a timestamp. The contents of this file will
be a barebones migration that does nothing more than a console.log.

The migration will also have an ID passed in to the Migration constructor
function. This is used to ensure idempotency within a given 
database / system. Running a migration more than once will only 
do the work once, based on the ID.

### Load Previous Data Structures

If you are migrating away from an old data structure, and no longer have a
model that represents this structure, you can use the data load feature.

After creating a migration instance, call the `.load` method, passing in an
object literal with key / value pairs. The key will be used to reference the
data that is returned. The value will be the name of the collection from which
data is loaded.

```js
migration.load({
  someData: "somecollection",
  moreData: {
    collection: "anothercollection",
    query: {someField: "some value"}
  }
});
```

When the migration is run, each of the collections specified in the `.load`
configuration will result in a data set being made made available to the steps.

If you need to limit the data that is loaded, from within a given collection,
you can specify any standard MongooseJS query, as shown in the above example.
If you do not need to limit the data returned, and want to retrieve the entire
collection, specifying the collection name directly will do that.

### Run Migration Steps

Now that you have a migration and have optionally specified a collection of
documents to load, you can define steps for your migration. Any given migration
can be built with 1 or more steps, using the `.step` method. This method receives
a single argument of a callback function. The callback function receives a
`data` parameter, and a `stepComplete` function parameter.

The `data` parameter will contain the named collections that were previously
defined by the `load` configuration.

When your step is complete, call the `stepComplete()` function.

The step definition function is where you will do the real work of transforming
your previous collection and document structure, in to your new MongooseJS
model structure. Be sure to require any MongooseJS model you need, so that you
can manipulate the data correctly.

```js
var MyModel = require("./models/myModel");

migration.step(function(data, stepComplete){

  var oldData = data.moreData[0];

  var myModel = new MyModel({
    something: oldData.something,
    newThing: { 
      what: oldData.old1,
      ever: + oldData.old
    },
    otherThing: oldData.moreStuff
  });

  myModel.save(function(err){
    if (err) { return stepComplete(err); }

    stepComplete();
  });
});

migration.step(function(data, stepComplete){
  // handle more steps for this migration, here
  // ...

  stepComplete();
});
```

In this example, a single model will be retrieved form the `moreData` collection
that was previously loaded. This model is used to create a new model, which is
then saved. After saving the model, the step is completed.

A second step is also defined in this example. Steps are run in the order in
which they are defined in the file. This allows you to have multiple steps that
potentially deal with multiple collections, or to have processes that are 
a little more involved be split apart.

### Remove Old Data Structures

Having migrated your data, you may wish to remove the old collection or models
from your database. This can be with the `remove` configuration, which works
the same was as the `load` configuration.

```js
migration.remove({
  someData: "somecollection",
  moreData: {
    collection: "anothercollection",
    query: {someField: "some value"}
  }
});
```

In this example, both the `somecollection` and `anothercollection` document
collections are removed from the database. In the case of `somecollection`,
all documents are removed. In the case of `anothercollection`, however, only
documents that match the query will be removed.

Note that the query for removing data can be any valid MongooseJS query, the
same as the `load` feature.

### Run The Migration

There are a few final steps in your script, to run the migration.

0. create a mongrate.js file
0. export a `connect` function that opens your database connection

```js
// mongrate.js

var mongoose = require("mongoose");

module.exports = {
  connect: function(cb){
    var conn = "mongodb://localhost:27017/some-database";
    mongoose.connect(conn, function(err){
      if (err) { throw err; }
      cb();
    });
  }
};
```

Having written this complete script, you can now run the mongrate
command line with no parameters, to execute your migrations:

```
mongrate
```

This will run the migration's load, steps and the remove processes. Running
this migration mutliple times will result in the work being done only once,
due to the ID passed in to the Migration constructor.

### View Prevously Run Migrations

If you would like to view the list of migrations that have been run on your
app instance, you can do that in two different ways.

0. Run the `Mongrate.MigrationModel.find` method
0. Examine the `_mongrateMigrations` collection directly

To run the MigrationModel's find method, require Mongrate in your script
and then execute the find method as you would any other MongooseJS model find
method.

```js
var Mongrate = require("mongrate");

Mongrate.MigrationModel.find(function(err, migrations){
  if (err) { throw err; }

  console.log(migrations);
});
```

This will print out a list of all migrations that have been run in the
current app database. You are free to use any MongooseJS methods to find
Migrations, using the MigrationModel - it is a standard MongooseJS model / 
schema.

If you wish to examine the `_mongrateMigrations` collection in your MongoDB
instance directly, you may do this however you wish. It will show you the same
information as the MigrationModel.find method.

## Legal Junk

Mongrate is &copy;2015 Muted Solutions, LLC. All Rights Reserved.

You may distribute and use Mongrate under the [MIT License](http://mutedsolutions.mit-license.org).
