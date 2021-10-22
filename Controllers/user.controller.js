const { validationResult, matchedData } = require("express-validator");
const nodemailer = require("nodemailer");
const dotenev = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/UserSchema");
const Enquiry = require("../Models/enquirySchema");
const Categorys = require("../Models/Category");
const Divisons = require("../Models/Division");
const Chapters = require("../Models/Chapters");

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
    if (name && contact && email && password && cpassword) {
      const userfound = await User.findOne({ EmailId: email });
      if (userfound) {
        res.send({
          message: "Email Already registered",
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
      } else {
        if (password == cpassword) {
          const code = Math.floor(1000 + Math.random() * 9000);
          const user = new User({
            Fullname: name,
            EmailId: email,
            Contact: contact,
            Password: password,
            Token: code,
            Isblock: false,
          });
          await user.save();
          res.send({
            message: "You are signup successfully",
            status: "true",
            sessionExist: "0",
            response: {
              data: {
                id: user._id,
                full_name: user.Fullname,
                email: user.EmailId,
                mobile: user.Contact,
                token: user.Token,
              },
            },
          });
        } else {
          res.send({
            message: "Password mismatch",
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
      }
    } else {
      res.send({
        message: "Please fill complete details",
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
  } catch (err) {
    res.send({
      message: "Failed to register",
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
};

//User login API
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const found = await User.findOne({ EmailId: email });
    if (email && password) {
      if (!found) {
        res.send({
          message: "Invalid Credentials",
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
      } else {
        const matchPassword = await bcrypt.compare(password, found.Password);
        const token = jwt.sign({ email: found.EmailId }, "NODEJS");
        matchPassword
          ? ((found.JWTToken = token),
            await found.save(),
            res.send({
              message: "You are successfully logged in",
              status: "true",
              sessionExist: "1",
              response: {
                data: {
                  id: found._id,
                  full_name: found.Fullname,
                  email: found.EmailId,
                  mobile: found.Contact,
                  token: found.JWTToken,
                },
              },
            }))
          : res.send({
              message: "Invalid Credentials",
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
    } else {
      res.send({
        message: "Please Enter Credentials",
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
  } catch (err) {
    console.log("Failed to login", err);
    res.send({
      message: "Login Api fail",
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
};

//forgot password API
const userForgotEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const userfound = await User.findOne({ EmailId: email });
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
        message: "if email id found reset code has been sent to your mail id",
        status: "true",
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
    } else {
      res.send({
        message: "if email id found reset code has been sent to your mail id",
        status: "true",
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
  } catch (err) {
    console.log("Failed to get email ", err);
    res.send({
      message: "forgot email api fail",
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
};

const forgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userfound = await User.findOne({ EmailId: email });
    console.log(userfound, otp);
    if (userfound && otp == userfound.Token) {
      res.send({
        message: "Correct OTP",
        status: "true",
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
    } else {
      res.send({
        message: "Invalid otp",
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
  } catch (err) {
    console.log("failed to get otp", err);

    res.send({
      message: "forgototp api fail",
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
};

//reset password without validation rules

const resetpass = async (req, res) => {
  const { email, password, cpassword } = req.body;
  try {
    if (email && password && cpassword) {
      const userfound = await User.findOne({ EmailId: email });
      if (userfound) {
        if (password == cpassword) {
          userfound.Password = password;
          await userfound.save();
          res.send({
            message: "Password changed Successfully",
            status: "true",
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
        } else {
          res.send({
            message: "Password mismatch",
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
      } else {
        res.send({
          message: "User not found",
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
    } else {
      res.send({
        message: "Please Fill complete details",
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
  } catch (err) {
    res.send({
      message: "Server error reset password  fail",
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
};

//User contactus API

const contactus = async (req, res) => {
  const { name, email, contact, message } = req.body;
  try {
    if (name && email && contact && message) {
      const enquiry = new Enquiry({
        Name: name,
        Email: email,
        Phone: contact,
        Message: message,
      });
      await enquiry.save();
      res.send({
        message: "Admin will contact to you soon",
        status: "true",
        sessionExist: "1",
        response: {
          data: {
            id: req.user._id,
            full_name: req.user.Fullname,
            email: req.user.EmailId,
            mobile: req.user.Contact,
            token: req.user.JWTToken,
          },
        },
      });
    } else {
      res.send({
        message: "Please Enter all required fields",
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
  } catch (err) {
    console.log("failed to contact", err);
    res.send({
      message: "Server error contact api fail",
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
};

//get data my acoount api
const myaccount = async (req, res) => {
  try {
    const alluser = req.user;
    // console.log(alluser.Fullname,alluser.EmailId, alluser.Contact)

    res.send({
      message: "My account data",
      status: "true",
      sessionExist: "1",
      response: {
        data: {
          id: alluser._id,
          full_name: alluser.Fullname,
          email: alluser.EmailId,
          mobile: alluser.Contact,
          token: alluser.JWTToken,
        },
      },
    });
  } catch (err) {
    res.send({
      message: "My account api fail",
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
};

//update data myaccount api
const updatemyaccount = async (req, res) => {
  const { name, contact } = req.body;
  try {
    if (name && contact) {
      req.user.Fullname = name;
      req.user.Contact = contact;
      await req.user.save();
      res.send({
        message: "Details Updated Successfully",
        status: "true",
        sessionExist: "1",
        response: {
          data: {
            id: req.user._id,
            full_name: req.user.Fullname,
            email: req.user.EmailId,
            mobile: req.user.Contact,
            token: req.user.JWTToken,
          },
        },
      });
    } else {
      res.send({
        message: "Please Enter in all required fields",
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
  } catch (err) {
    res.send({
      message: "Update account api fail",
      status: "false",
      sessionExist: "1",
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
};

//change password api
const changepassword = async (req, res) => {
  const { old_password, new_password, cnew_password } = req.body;
  try {
    if (old_password && new_password && cnew_password) {
      const isMatch = await bcrypt.compare(old_password, req.user.Password);
      if (isMatch) {
        if (new_password == cnew_password) {
          req.user.Password = new_password
            await req.user.save(),
            res.send({
              message: "Password Updated successfully",
              status: "true",
              sessionExist: "1",
              response: {
                data: {
                  id: req.user._id,
                  full_name: req.user.Fullname,
                  email: req.user.EmailId,
                  mobile: req.user.Contact,
                  token: req.user.JWTToken,
                },
              },
            });
        } else {
          res.send({
            message: "Please mismatch",
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
      } else {
        res.send({
          message: "You have entered current password wrong",
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
    } else {
      res.send({
        message: "Please Enter in all required fields",
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
  } catch (err) {
    res.send({
      message: "Change password api fail",
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
};

//For admin show all user list
const allusers = async (req, res) => {
  User.find({}, (err, data) => {
    if (data) {
      // console.log(req.user.EmailId);
      // var alldata = data.filter((i) => i.EmailId !== req.user.EmailId);
      // res.json(alldata);
      res.send(data)
    } else {
      res.send(err);
    }
  });
};

//For admin block and unblock user
const block_Unblock_User = async (req, res) => {
  const found = await User.findById(req.body.id);
  if (found) {
    found.Isblock = !found.Isblock;
    await found.save();
    if (found.Isblock) {
      res.send({ msg: found.EmailId + " is blocked by admin" });
    } else {
      res.send({ msg: found.EmailId + " is unblocked by admin" });
    }
  } else {
    res.send({ msg: "User not found in database" });
  }
};

const categorypost=async(req,res)=>{
  const {CategoryName}=req.body;
  try{
    if(CategoryName){
     const category=new Categorys({
      CategoryName
     })
     await category.save();
     res.send("category add");
    }
    else{
      res.send("please enter category name")
    }
  }
  catch(err){
    console.log("error",err);
    res.send("category post api fail")
  }
}

const categoryshow=async(req,res)=>{
  try{
     Categorys.find({},(err,data)=>{
       if(err) throw err;
       console.log(data);
       res.send({data});
     })
  }
  catch(err){
    console.log("error",err);
    res.send("category get api fail")
  }
}

const divisonpost=async(req,res)=>{
  const {DivisionName,CategoryId}=req.body;
   try{
     if(DivisionName && CategoryId){
     const divison=new Divisons({
      DivisionName,
       CategoryId
     })
     await divison.save();
     res.send("divison added");
     }
     else{
       res.send("Please enter division name")
     }
   }
    catch(err){
    console.log("error",err);
    res.send("divison post api fail")
  }
}
const divisionshow=async(req,res)=>{
  const {categoryid}=req.headers;
  console.log(categoryid)
  try{
     Divisons.find({},(err,data)=>{
       if(err) throw err;
      //  console.log(data);
       const divs=data.filter(e=>e.CategoryId==categoryid);
       console.log(divs);
       res.send(divs);
      // res.send(data);
     })
  }
  catch(err){
    console.log("error",err);
    res.send("division get api fail")
  }
}




const chapterpost=async(req,res)=>{
  const {ChapterName,DivisionId}=req.body;
   try{
     if(ChapterName && DivisionId){
     const chapter=new Chapters({
      ChapterName,
      DivisionId
     })
     await chapter.save();
     res.send("chapter added");
     }
     else{
       res.send("Please enter chapter name")
     }
   }
    catch(err){
    console.log("error",err);
    res.send("chapter post api fail")
  }
}

const chaptershow=async(req,res)=>{
  const {divisionid}=req.headers;
  console.log(divisionid)
  try{
     Chapters.find({},(err,data)=>{
       if(err) throw err;
       const chapters=data.filter(e=>e.DivisionId==divisionid);
       console.log(chapters);
       res.send(chapters);
     })
  }
  catch(err){
    console.log("error",err);
    res.send("chapter get api fail")
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
  block_Unblock_User,
  categorypost,
  categoryshow,
  divisonpost,
  divisionshow,
  chapterpost,
  chaptershow
};
