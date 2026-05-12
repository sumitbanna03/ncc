const express = require("express");
const Player = require("../models/players.js");
const multer = require("multer");
if(process.env.NODE_ENV != "production"){
require('dotenv').config(); // Load your API keys from a .env file
}
const {storage} = require("../cloudConfig.js");
const {cloudinary} = require("../cloudConfig.js");
const upload = multer({ storage });

const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const {isAuthenticated} = require("../authentic.js");
const methodOverride  = require("method-override");
const { read } = require("fs");

router.use(methodOverride("_method"));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function asyncWrap(fn){
  return(
   function(req,res,next){
    fn(req,res,next).catch((err)=>next(err));
   }
  );
}


router.get("/",isAuthenticated,(req,res)=>{
  res.render("profile");
});
router.get("/edit/:id",isAuthenticated,asyncWrap( async(req,res,next)=>{
  const {id} = req.params;
  const player = await Player.findById(id);
  res.render("editProfile", {player});
}));
router.patch("/:id", asyncWrap(async(req,res,next)=>{
  const {id} = req.params;
   const name = req.body.name + ".";
   const username = req.body.username;
      const role = req.body.role;
  const bat = req.body.batting;
   const bowl = req.body.bowling;
  const age = req.body.age;
  const jerseyNo = req.body.jerseyNo;
 const updatedPlayer = await Player.findByIdAndUpdate(id,{
  name:name,
  username:username,
  role:role,
  batting:bat,
  bowling:bowl,
  age:age,
  jerseyNo:jerseyNo,
  },
  {new: true});
  req.login(updatedPlayer, (err) => {
    if (err) return next(err);
    req.flash("success","Profile updated");
    res.redirect("/profile");
  });
}));
router.get("/edit-img/:id",isAuthenticated,asyncWrap(async(req,res)=>{
    const {id} = req.params;
    const player = await Player.findById(id);
    res.render("editImg", {player});
}));
// router.patch("/edit-img/:id",upload.single("img"),asyncWrap(async (req,res,next)=>{
//     const {id} = req.params;
//     const img = req.file.filename;
//     await Player.findByIdAndUpdate(id,{
//         img:img,
//     });
//     res.redirect("profile");
// }));
router.patch("/edit-img/:id", isAuthenticated, upload.single("img"), asyncWrap(async (req, res, next) => {
    const { id } = req.params;

    // Check if a file was actually uploaded
    if (!req.file) {
        req.flash("error", "No image selected!");
        return res.redirect(`/profile/edit/${id}`);
    }

    const filename = req.file.filename;
    const url = req.file.path;
    // Update only the image field in the database
    await Player.findByIdAndUpdate(id, { img: {url,filename} });

    req.flash("success", "Profile picture updated!");
    res.redirect("/profile");
}));
router.get("/edit-password/:id",isAuthenticated, asyncWrap(async (req,res,next)=>{
  const {id} = req.params;
  const player = await Player.findById(id);
    res.render("editPassword", {player});
}));
router.patch("/edit-password/:id", asyncWrap(async (req,res,next)=>{
  const { currPassword, newPassword } = req.body;
  const {id} = req.params;


  try {
    const player = await Player.findById(id);
      await player.changePassword(currPassword, newPassword);
        await player.save();   
         req.flash("success", "Password updated successfully");
    res.redirect("/profile");
  } catch (err) {
    req.flash("error", "Current password is incorrect");
    res.redirect(`/profile/edit-password/${id}`);
  }

}));

module.exports = router;