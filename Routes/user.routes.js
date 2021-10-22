const express = require("express");
const requireAuth = require("../Middleware/requireAuth");
const validationRule = require("../config/validationRules");

const router = express.Router();
const controller = require("../Controllers/user.controller");
const Authorization = require("../Middleware/Authorization");

router.get("/auth", requireAuth, (req, res) => {
  res.status(200).send({ msg: "You are Authorisexd user" });
});

router.post("/signup", Authorization, controller.userRegister);
router.post("/login", Authorization,controller.userLogin);
router.post("/forgot",Authorization, controller.userForgotEmail);
router.post("/forgotOTP",Authorization, controller.forgotOTP);
router.post("/resetpass",Authorization, controller.resetpass);
router.get("/myaccount", Authorization,requireAuth, controller.myaccount);
router.post("/updateaccount",Authorization,requireAuth, controller.updatemyaccount);
router.post("/changepassword",Authorization, requireAuth, controller.changepassword)


//mobile app
router.post(
  "/contactus",
  Authorization,
  requireAuth,
  controller.contactus
);


//catgories
router.post("/categorypost",controller.categorypost);
router.get("/categoryshow",controller.categoryshow);

//divisons
router.post("/divisionpost",controller.divisonpost);
router.get("/divisionshow",controller.divisionshow);

//chapters
router.post("/chapterpost",controller.chapterpost);
router.get("/chaptershow",controller.chaptershow);



//admin panel
router.get("/getusers", controller.allusers);
router.post("/blUser",requireAuth,controller.block_Unblock_User);

module.exports = router;
