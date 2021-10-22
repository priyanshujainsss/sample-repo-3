const mongoose = require("mongoose");
const chapterSchema = new mongoose.Schema({
 
  ChapterName: {
    type: String,
    required: true,
  },
  DivisionId:{
      type:String
  }
});
const Chapters = mongoose.model("chapters", chapterSchema);
module.exports =  Chapters 
