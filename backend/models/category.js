const mongoose = require("mongoose"); // used to connect to a MongoDB database

//schema defines the structure of the documents within a MongoDB collection
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

//creates a model based on the provided schema
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
