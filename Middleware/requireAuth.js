const jwt =require("jsonwebtoken");
const User=require("../Models/UserSchema");
const dotenv= require("dotenv");

dotenv.config();
const jwtsecret=process.env.JWTSECRET;

module.exports=async(req,res,next)=>{
    const {Authentication_token}=req.body;
    // console.log("Authentication_token",Authentication_token)
    if(!Authentication_token){
        return  res.send({
          message: "You must be logged in 1",
          status: "false",
          sessionExist: "0",
          response: {
            data: {
              id: null,
              full_name: null,
              email: null,
              mobile: null,
              token: null,
            },
          },
        });
    }
    const token=Authentication_token;

    // const token=Authentication_token.split(" ")[1];
    jwt.verify(token,jwtsecret,async(err,payload)=>{
        if(err){
         return  res.send({
            message: "You must be logged in 2",
            status: "false",
            sessionExist: "0",
            response: {
              data: {
                id: null,
                full_name: null,
                email: null,
                mobile: null,
                token: null,
              },
            },
          });
        //   res.status(401).send({error:"you must be logged in ",err:err.message})
        }

        const {email}=payload;
        const user= await User.findOne({EmailId:email});
        req.user=user;
        // console.log(user.JWTToken == token);
        if(user.JWTToken != token){
          return   res.send({
            message: "You must be logged in 3",
            status: "false",
            sessionExist: "0",
            response: {
              data: {
                id: null,
                full_name: null,
                email: null,
                mobile: null,
                token: null,
              },
            },
          });
        //   res.status(401).send({error:"you must be logged in "});
        }
        next();
    })
}