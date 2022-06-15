var jwt = require("jsonwebtoken");

module.exports = {
    verifyToken : async function(req,res,next){
        try {
            var token = req.headers.authorization;
            if(token){
                var payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                return next()
            }
        } catch (error) {
            next(error)
        }
    }
}