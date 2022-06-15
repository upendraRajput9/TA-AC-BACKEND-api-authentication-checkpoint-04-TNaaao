var mongoose = require('mongoose');
var slug = require("slug");
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    tags:[String],
    answers :[{type:Schema.Types.ObjectId,ref:"Answer"}],
    title : {type:String,required:true},
    description: String,
    author:{type:Schema.Types.ObjectId,ref:"User"},
    slug:String,
    comment :[{type:Schema.Types.ObjectId,ref:"Comment"}]
},{timestamps:true})

questionSchema.pre("save", function(next){
    this.slug = slug(this.title,"-");
    next()
})

module.exports = mongoose.model("Question",questionSchema)