const { validationResult, matchedData } = require("express-validator");
const nodemailer = require("nodemailer");
const dotenev = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/UserSchema");
const Enquiry = require("../Models/enquirySchema");

dotenev.config();

// Sending mail by nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER,
    pass: process.env.PASSWORD,
  },
});

// User signup API
const userRegister = async (req, res) => {
  const { name, contact, email, password, cpassword } = req.body;
  try {
    // check is email already registered
    const found = await User.findOne({ EmailId: email });
    if (found) {
      res.send({
        message:"Email Already Registered",
        status:"false",
        sessionExist:"0",
        response:{
          data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
          }
        }
      })
 

      // res.send("Email Already Registered");
    } else {
      //form validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var errMsg = errors.mapped();
        var inputData = matchedData(req);
      } else {
        var inputData = matchedData(req);
      }

      const code = Math.floor(1000 + Math.random() * 9000);
      JSON.stringify(req.body) == JSON.stringify(inputData)
        ? transporter.sendMail(
            {
              to: email,
              subject: "Verification Code for your law codes account",
              html: `<h4>Your account verification code is ${code}</h4>`,
            },
            async function (err, info) {
              if (err) console.log("error", err.message);
              else {
                console.log("email send successfully");
                res.send({
                  message:"Verification code has been sent to your mail id",
                  status:"true",
                  sessionExist:"0",
                  response:{
                    data:{
                      id:null,
                      full_name:null,
                      email:null,
                      mobile:null,
                      token:null
                    }
                  }
                })

                // res.status(200).json({
                //   msg: "Verification code has been send to your mail id",
                // });

                //Data save code write here
                //   {
                const user = new User({
                  Fullname: name,
                  EmailId: email,
                  Contact: contact,
                  Password: password,
                  Token: code,
                  Isblock:false
                });
                await user.save();
                //   }
              }
            }
          )
        : (console.log(errors),

        res.send({
          message:"Please Fill correct Details",
          status:"false",
          sessionExist:"0",
          response:{
            data:{
              id:null,
              full_name:null,
              email:null,
              mobile:null,
              token:null
            }
          }
        }))

          // res
          //   .status(400)
          //   .json({ errors: errMsg, msg: "Please Fill correct Details" }));
    }
  } catch (err) {
    console.log("error on userRegister", err);
    res.send({
      message:"IFailed to register",
      status:"false",
      sessionExist:"0",
      response:{
        data:{
          id:null,
          full_name:null,
          email:null,
          mobile:null,
          token:null
        }
      }
    })


    // res.send("Failed to register");
  }
};

//User login API
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const found = await User.findOne({ EmailId: email });

    if (!found) {
       res.send({
         message:"Invalid Credentials",
         status:"false",
         sessionExist:"0",
         response:{
           data:{
             id:null,
             full_name:null,
             email:null,
             mobile:null,
             token:null
           }
         }
       })
      // res.send({ msg: "Invalid Credentials",status:401 });
    } else {
      const matchPassword = await bcrypt.compare(password, found.Password);
      const token = jwt.sign({ email: found.EmailId }, "NODEJS");
      matchPassword
        ?(found.JWTToken=token, await found.save(), 
        
        // res.status(200).send({ msg: "Login Successfully", token: token,status:200 })
        res.send({
          message:"You are successfully logged in",
          status:"true",
          sessionExist:"1",
          response:{
            data:{
              id:found._id,
              full_name:found.Fullname,
              email:found.EmailId,
              mobile:found.Contact,
              token:found.JWTToken
            }
          }
        })
        
        
        )
        : res.send({
          message:"Invalid Credentials",
          status:"false",
          sessionExist:"0",
          response:{
            data:{
              id:null,
              full_name:null,
              email:null,
              mobile:null,
              token:null
            }
          }
        })

        // res.send({ msg: "Invaild Credentials", status:401 });
    }
  } catch (err) {
    console.log("Failed to login", err);
    res.send({
      message:"Login Api fail",
      status:"false",
      sessionExist:"0",
      response:{
        data:{
          id:null,
          full_name:null,
          email:null,
          mobile:null,
          token:null
        }
      }
    })
 

    // res.json({ msg: "Login api fail", err: err });
  }
};


//forgot password API
const userForgotEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const userfound = await User.findOne({ EmailId: email });
    // res.json({output:found})
    console.log(userfound);
    if (userfound) {
      const code = Math.floor(1000 + Math.random() * 9000);
      userfound.Token = code;
      await userfound.save();
      transporter.sendMail({
        to: email,
        subject: "Reset Password Verification code",
        html: `<h4>Use this ${code} 4 digit code to reset your account Password </h4>`,
      });

      res.send({
        message:"if email id found reset code has been sent to your mail id",
        status:"true",
        sessionExist:"0",
        response:{
          data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
          }
        }
      })
      // res.json({
      //   msg: "if email id found reset code has been sent to your mail id",
      // });
    } else {
      res.send({
        message:"if email id found reset code has been sent to your mail id",
        status:"true",
        sessionExist:"0",
        response:{
          data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
          }
        }
      })

      // res.json({
      //   msg: "if email id found reset code has been sent to your mail id  ",
      // });
      
    }
  } catch (err) {
    console.log("Failed to get email ", err);
    res.send({
      message:"forgot email api fail",
      status:"false",
      sessionExist:"0",
      response:{
        data:{
          id:null,
          full_name:null,
          email:null,
          mobile:null,
          token:null
        }
      }
    })
    // res.json({msg:"reset email api fail ",err})
  }
};

const forgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userfound = await User.findOne({ EmailId: email });
    console.log(userfound, otp);
    if (userfound && otp == userfound.Token) {
     
      res.send({
        message:"Correct OTP",
        status:"true",
        sessionExist:"0",
        response:{
          data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
          }
        }
      })

      // res.json({ msg: "Correct otp",status:200 });


    } else {
      res.send({
        message:"Invalid otp",
        status:"false",
        sessionExist:"0",
        response:{
          data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
          }
        }
      })

      // res.json({ msg: "Invalid otp",status:400 });
    }
  } catch (err) {
    console.log("failed to get otp", err);

    res.send({
      message:"forgototp api fail",
      status:"false",
      sessionExist:"0",
      response:{
        data:{
          id:null,
          full_name:null,
          email:null,
          mobile:null,
          token:null
        }
      }
    })

    // res.json({ msg: "forgototp api fail",err });
  }
};

//reset password api

// const resetpass = async (req, res) => {
//   const { email, password, cpassword } = req.body;
//   try {
//     const userfound = await User.findOne({ EmailId: email });
//     console.log(userfound);
//     if (userfound) {
//       if(password && cpassword){

//       const errors = validationResult(req);
//       console.log("forgot error ", errors);
//       if (!errors.isEmpty()) {
//         var errMsg = errors.mapped();
//         var inputData = matchedData(req);
//       } else {
//         var inputData = matchedData(req);
//       }
//       console.log("input Data", inputData, errMsg);
//       data={password:password,cpassword:cpassword}
//       JSON.stringify(inputData) == JSON.stringify(data)
//         ? ((userfound.Password = password),
//           await userfound.save(),
//           res.status(400).send({
//             message:"Password Changed Successfully",
//             status:"true",
//             sessionExist:"0",
//             response:{
//               data:{
//                 id:null,
//                 full_name:null,
//                 email:null,
//                 mobile:null,
//                 token:null
//               }
//             }
//           }))
           

//           // res.status(200).json({ msg: "Password Changed successfully", status:200 }))
//         : res.json({ err: errMsg, status:401 });
//       }
//         else{
//           res.status(400).send({
//             message:"Please Enter password",
//             status:"false",
//             sessionExist:"0",
//             response:{
//               data:{
//                 id:null,
//                 full_name:null,
//                 email:null,
//                 mobile:null,
//                 token:null
//               }
//             }
//           })
//         }
//     } else {
//       res.status(400).send({
//         message:"Failed to find user",
//         status:"false",
//         sessionExist:"0",
//         response:{
//           data:{
//             id:null,
//             full_name:null,
//             email:null,
//             mobile:null,
//             token:null
//           }
//         }
//       })
//       // res.json({ msg: "Failed to find user" });
//     }
//   } catch (err) {
//     console.log("Failed to update password", err);
//     res.json({ msg: "reset password api fail", err: err });
//   }
// };

//reset password without validation rules

const resetpass=async(req,res)=>{
  const {email, password, cpassword}=req.body;
  try{
  if(email && password && cpassword){
   const userfound=await User.findOne({EmailId:email});
   if(userfound){
        if(password == cpassword){
          userfound.Password=password;
          await userfound.save();
          res.send({
            message:"Password changed Successfully",
            status:"true",
            sessionExist:"0",
            response:{
            data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
            }
          }
          }) 
        } 
        else{
          res.send({
            message:"Password not match",
            status:"false",
            sessionExist:"0",
            response:{
            data:{
            id:null,
            full_name:null,
            email:null,
            mobile:null,
            token:null
            }
          }
          })
        }
 

   }
   else{
    res.send({
      message:"User not found",
      status:"false",
      sessionExist:"0",
      response:{
      data:{
      id:null,
      full_name:null,
      email:null,
      mobile:null,
      token:null
      }
    }
    })
   }


  }

  else{
    res.send({
      message:"Please Fill complete details",
      status:"false",
      sessionExist:"0",
      response:{
      data:{
      id:null,
      full_name:null,
      email:null,
      mobile:null,
      token:null
      }
    }
    })
  }
  }
  catch(err){
    res.send({
      message:"Server error reset password  fail",
      status:"false",
      sessionExist:"0",
      response:{
      data:{
      id:null,
      full_name:null,
      email:null,
      mobile:null,
      token:null
      }
    }
    })
  }
}






//User contactus API

const contactus = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    // if (name && email && phone && message) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var errMsg = errors.mapped();
        var inputData = matchedData(req);
      } else {
        var inputData = matchedData(req);
      }
      if (errMsg) {
        var allerror = {};
        for(var key in errMsg){
          allerror[key]=errMsg[key].msg;
        }
        res.status(400).json(allerror);
      } else {
        const enquiry = new Enquiry({
          Name: name,
          Email: email,
          Phone: phone,
          Message: message
        });
        await enquiry.save();
        res.status(200).json({ msg: "Admin will Contact to you soon" });
      }
  } catch (err) {
    console.log("failed to contact", err);
    res.status(504).json({ msg: "failed to contact", err: err });
  }
};

//get data my acoount api
const myaccount=async(req,res)=>{
  try{
    const alluser=req.user
    // console.log(alluser.Fullname,alluser.EmailId, alluser.Contact)
    res.send({
      Fullname:alluser.Fullname,
      Contact:alluser.Contact,
      Email:alluser.EmailId
    })
  }
  catch(err){
    res.send({msg:"My account api fail",err})
  }
}

//update data myaccount api
const updatemyaccount=async(req,res)=>{
  const {name,phone}=req.body;
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errMsg = errors.mapped();
      var inputData = matchedData(req);
    } else {
      var inputData = matchedData(req);
    }
    if(errMsg){
      var err={};
      for(var key in errMsg){   
        err[key]=errMsg[key].msg;      
      }
      res.send(err);

    }else    
    res.send({msg:"Your details successfully updated"})
  }
  catch(err){
    res.send({msg:"update account api fail",err})
  }
}


//change password api
const changepassword=async(req,res)=>{
   try{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      var errMsg=errors.mapped();
      var inputData=matchedData(req);
    }else{
      var inputData=matchedData(req);
    }
 if(errMsg){
  const err={};
  for( var key in errMsg){
    err[key]=errMsg[key].msg;
  }
    res.status(400).send(err);
 }
 else{
   const isMatch=await bcrypt.compare(req.body.oldpassword,req.user.Password);
  isMatch? (
    req.user.Password=req.body.newpassword,
    await req.user.save(),
    res.send({msg:'Password Updated successfully'}) ): res.status(400).send({oldpassword:"Please enter correct old password"})
 }
   }
   catch(err){
     res.send({msg:"change password api fail",err})
   }
}






//For admin show all user list
const allusers=async(req,res)=>{
 User.find({},(err,data)=>{
   if(data){
     console.log(req.user.EmailId);
     var alldata=data.filter(i=>i.EmailId !== req.user.EmailId)
     res.json(alldata)
   }
   else{
     res.send(err)
   }
 })
}

//For admin block and unblock user
const block_Unblock_User=async(req,res)=>{
 const found=await User.findById(req.body.id);
 if(found){
   found.Isblock=!found.Isblock;
   await found.save();
   if(found.Isblock){
     res.send({msg:found.EmailId+" is blocked by admin"});
  }
   else{
    res.send({msg:found.EmailId+" is unblocked by admin"});
   }
 }
 else{
   res.send({msg:"User not found in database"});
 }

}

module.exports = {
  userRegister,
  userLogin,
  userForgotEmail,
  forgotOTP,
  resetpass,
  contactus,
  myaccount,
  updatemyaccount,
  changepassword,
  allusers,
  block_Unblock_User
};
