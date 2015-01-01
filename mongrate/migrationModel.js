var mongoose = require("mongoose");

var Schema = mongoose.Schema({
  migrationId: {type: String, required: true},
  description: {type: String, required: false},
  dateMigrated: {type: Date, default: Date.now}
});

module.exports = mongoose.model("mongrateMigration", Schema);
