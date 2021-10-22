const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
 
  CategoryName: {
    type: String,
    required: true,
  }
});
const Categorys = mongoose.model("categories", categorySchema);
module.exports =  Categorys 
