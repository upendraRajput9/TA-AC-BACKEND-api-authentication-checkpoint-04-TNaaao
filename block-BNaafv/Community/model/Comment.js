var mongoose = require("mongoose");
const Question = require("./Question");
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    questionId:{type:Schema.Types.ObjectId,ref:Question},
    content:{type:String,required:true},
    author:{type:Schema.Types.ObjectId,ref:"user"}
})

module.exports = mongoose.model("Comment",commentSchema);