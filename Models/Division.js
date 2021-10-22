const mongoose = require("mongoose");
const divisonSchema = new mongoose.Schema({
 
  DivisionName: {
    type: String,
    required: true,
  },
  CategoryId:{
      type:String
  }
});
const Divisons = mongoose.model("divisions", divisonSchema);
module.exports =  Divisons 
