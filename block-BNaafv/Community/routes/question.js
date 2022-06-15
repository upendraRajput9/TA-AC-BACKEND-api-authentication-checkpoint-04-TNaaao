var express = require('express');
var Question = require('../model/Question');
var Answer = require('../model/Answer');
const auth = require('../middelware/auth');
var Comment = require('../model/Comment')
var router = express.Router();

/* GET home page. */

//All questions
router.use(auth.verifyToken)

router.get('/',async function(req, res, next) {
  try {
      var questions = await Question.find({});
      res.status(201).json({questions});
  } catch (error) {
      next(error)
  }
});


//Create Question
router.post("/questions",async (req,res,next)=>{
    req.author = req.user.userId;
    req.tags = req.body.tags.split(" ")
    try {
        var question = await Question.create(req.body)
        res.status(201).json({question})
    } catch (error) {
        next(error)
    }
})

//Update question

router.put("/questions/:questionId",async (req,res,next)=>{
    var questionId = req.params.questionId;
    try {
        var question = await Question.findById(questionId)
if(question.author ==req.user.userId){
    question = await Question.findByIdAndUpdate(questionId,res.body);
  return  res.status(201).json({question});
}else{
    res.status(201).json({error:"author id is not match"});
}
    } catch (error) {
        next(error)
    }
})

//delete question
router.delete("/questions/:slug",async (req,res,next)=>{
    var questionId = req.params.questionId;
    try {
        var question = await Question.findById(questionId)
        if(question.author ==req.user.userId){
            question = await Question.findByIdAndDelete(questionId);
          return  res.status(201).json({question});
        }else{
            res.status(201).json({error:"author id is not match"});
        }
    } catch (error) {
        next(error)
    }
});

//Add answer
router.post("/questions/:questionId/answers",async (req,res,next)=>{
    var id = req.params.questionId;
    req.body.questionId = req.params.questionId;
    req.body.author = req.user.userId
    try {
        var answer = await Answer.create(req.body)
        var question = await Question.findByIdAndUpdate(id,{$push:{answers:answer._id}})
        res.status(201).json({answer})
    } catch (error) {
        next(error)
    }
})


//list answer
router.get("/questions/:questionId/answers",async (req,res,next)=>{
    var id = req.params.questionId;
    try {
        var question = await Question.findById(id).populate("answers");
        res.status(201).json({answers:question.answers})
    } catch (error) {
        
    }
})

//Update answer
router.put("/answers/:answerId",async (req,res,next)=>{
    var id = req.params.answerId;
    try {
        var answer = await Answer.findById(id)
if(answer.author ==req.user.userId){
  answer =await Answer.findByIdAndUpdate(id,req.body);
    res.status(201).json({answer:answer})
}else{
    res.status(201).json({error:"author id is not match"});
}
    } catch (error) {
        
    }
})

//Delete answer
router.delete("/answers/:answerId",async (req,res,next)=>{
    var id = req.params.answerId;
    try {
        var answer = await Answer.findById(id)
if(answer.author ==req.user.userId){
     answer =await Answer.findByIdAndDelete(id);
    var question = await Question.findOneAndUpdate(answer.questionId,{$pull:{answers:answer._id}})
    res.status(201).json({answer:answer})
}else{
    res.status(201).json({error:"author id is not match"});
}
    } catch (error) {
        
    }
})

//List tags
router.get("/tags",async (req,res,next)=>{
    try {
     var tags = await Question.distinct("tags")
        res.status(201).json({tags});
    } catch (error) {
        next(error)
    }
})

//comment 
router.post("/:questionId/comment",async (req,res,next)=>{
    var id = req.params.questionId;
    req.body.questionId = id;
    req.body.author = req.user.userId;
    try {
        var comment = await Comment.create(req.body);
        var question = await Question.findByIdAndUpdate(id,{$pull:{comment:comment._id}})
        res.status(201).json({comment})
    } catch (error) {
        next(error)
    }
})

//update comment
router.put("/:commentId",async (req,res,next)=>{
    var id = req.params.commentId;
    try {
        var comment = await Comment.findById(id);
        if(comment.author==req.user.userId){
            var comment = await Comment.findByIdAndUpdate(id,{content:req.body.content});
            res.status(201).json({comment})
        }else{
            res.status(201).json({error:"author id is not match"});
        }
       
    } catch (error) {
        next(error)
    }
})

//delete comment
router.delete("/:commentId",async (req,res,next)=>{
    var id = req.params.commentId;
    try {
        var comment = await Comment.findById(id);
        if(comment.author==req.user.userId){
        var comment = await Comment.findByIdAndDelete(id);
        res.status(201).json({comment})
        }else{
            res.status(201).json({error:"author id is not match"});
        }
    } catch (error) {
        next(error)
    }
})




module.exports = router;
