var express = require('express');
const User = require('../model/User');
var auth = require('../middelware/auth')

var router = express.Router();

/* GET users listing. */
router.get('/',async function(req, res, next) {
  try {
    var users = await User.find({});
    res.status(201).json({users})
  } catch (error) {
    next(error)
  }
});

//register
router.post('/',async (req,res,next)=>{
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({user:user.userJson(token)})
  } catch (error) {
    next(error)
  }
});

//login
router.post('/login',async (req,res,next)=>{
  
 var {email,password} = req.body;
 if(!email||!password){
   return res.status(401).json({error:"Email/Password is required"})
 }
  try {
    var user = await User.findOne({email});
    if(!user){
      return res.status(403).json({error:"Email is not register"})
    }
    var result = await user.verifyPassword(password);
    if(!result){
      return res.status(403).json({error:"password is invalid"})
    }
    var token = await user.signToken();
    res.status(201).json({user:user.userJson(token)})
  } catch (error) {
    next(error)
  }
})

//protected
router.use(auth.verifyToken)

//current user
router.get("/current-user",async (req,res,next)=>{
  try {
    var user = await User.findById(req.user.userId)
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
})


//profile
router.get("/profile/:username",async (req,res,next)=>{
  var username = req.params.username
  try {
    var user = await User.findOne({username})
    res.status(201).json({profile:user.profileJson()})
  } catch (error) {
    next(error)
  }
})

//profile update
router.put('/profile/:username',async (req,res,next)=>{
  var username = req.params.username
  try {
    var user = await User.findOneAndUpdate({username},req.body);
    var token = await user.signToken();
    res.status(201).json({user:user.json(token)})
  } catch (error) {
    next(error)
  }
})

// following
router.get('/:id/follow',async (req,res,next)=>{
  var id = req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.userId,{$push:{followingList:id}});
    var followuser =await User.findByIdAndUpdate(id,{$push:{followerList:user._id}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
});

//unfollow
router.get('/:id/unfollow',async (req,res,next)=>{
  var id = req.params.id;
  try {
    var user = await User.findByIdAndUpdate(req.user.user,{$pull:{followingList:id}});
    var followuser =await User.findByIdAndUpdate(id,{$pull:{followerList:user._id}});
    res.status(201).json({user})
  } catch (error) {
    next(error)
  }
});

//admin
router.get("/:userId/block",async (req,res,next)=>{
  var id = req.params.userId;

  try {
    var user = await User.findById(req.user.userId);
    if(user.isAdmin==true){
      user = await User.findByIdAndUpdate(id,{isBlocked:true});
      res.status(201).json({user:user.name + "is blocked"})
    }else{
      res.status(201).json("Admin can blocked the user")
    }
  } catch (error) {
    next(error)
  }

})

//unblock
router.get("/:userId/block",async (req,res,next)=>{
  var id = req.params.userId;

  try {
    var user = await User.findById(req.user.userId);
    if(user.isAdmin==true){
      user = await User.findByIdAndUpdate(id,{isBlocked:false});
      res.status(201).json({user:user.name + "is unblocked"})
    }else{
      res.status(201).json("Admin can unblocked the user")
    }
  } catch (error) {
    next(error)
  }

})
module.exports = router;