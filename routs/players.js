const express = require("express");
const Player = require("../models/players.js");
const multer = require("multer");
if(process.env.NODE_ENV != "production"){
require('dotenv').config(); // Load your API keys from a .env file
}
const {storage} = require("../cloudConfig.js");
const {cloudinary} = require("../cloudConfig.js");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const {isAuthenticated} = require("../authentic.js");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function asyncWrap(fn){
  return(
   function(req,res,next){
    fn(req,res,next).catch((err)=>next(err));
   }
  );
}


// const storage = multer.diskStorage({
//   destination: "./public/images/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

const upload = multer({ 
       storage,
  // limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  // fileFilter: (req, file, cb) => {
  //   const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  //   if (allowedMimes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only image files are allowed'));
  //   }
  // }
});

router.get("/",asyncWrap(async(req,res,next)=>{
 
 const result=  await Player.find();
    res.render("player.ejs", {players:result});
   
   
}));
router.get("/profile/:id",asyncWrap(async (req,res,next)=>{
  const {id} = req.params;
  const player = await Player.findById(id);
  res.render("player-profile", {player});
}));
router.get("/new",isAuthenticated,asyncWrap(async(req, res,next)=>{
    if(res.locals.currUser.isAdmin){
    res.render("newPlayer.ejs");
    }else{
      req.flash("error","you are not Admin to add player");
      res.redirect("/");
    }
    
}));
router.post("/",isAuthenticated, upload.single("img"), async(req, res,next) => {
    if(!res.locals.currUser.isAdmin){
      req.flash("error","you are not Admin to add player");
      res.redirect("/");
    }
    
try {
     const name = req.body.name + ".";
   const username = req.body.username;
   let password = req.body.password;
      const role = req.body.role;
  const bat = req.body.batting;
   const bowl = req.body.bowling;
  const age = req.body.age;
  const jerseyNo = req.body.jerseyNo;
  // const imagePath =  req.file.path;
  const url = req.file.path;
const fileName = req.file.filename;
const isAdmin = req.body.isAdmin == "on"?true:false;
  let player = new Player({
  name:name,
  username: username,
  role:role,
  batting:bat,
  bowling:bowl,
  age:age,
  jerseyNo: jerseyNo,
  img:{url:url, filename:fileName},
  isAdmin:isAdmin
 });
await Player.register(player, password).then((res)=>console.log(res));
 req.flash("success", "New player added");
 res.redirect("/players");
} catch (err) {
  req.flash("error", err.message);
  res.redirect("/players");
}
 
});


router.get('/search',asyncWrap( async(req, res,next) => {
 
   const search = req.query.q;

  if (!search) {
    return res.json([]);
  }

 const results = await Player.find({
  name: { $regex: search, $options: "i" }
})
  res.json(results);


}));
router.get("/delete",isAuthenticated,(req,res)=>{
    if(res.locals.currUser.isAdmin){
    res.render("deletePlayer.ejs");
    }else{
      req.flash("error","you are not Admin to delete player");
      res.redirect("/players");
    }
});
router.delete("/",asyncWrap(async(req,res)=>{
    const {username} = req.body;
    const player = await Player.findOne({username: username});
    
    if(player){
      if(player.username == res.locals.currUser.username){
      req.flash("error","You can not delete yourself");
      return res.redirect("/players/delete");
    }
      if(player.isAdmin){
      req.flash("error","You can not delete Admin");
     return res.redirect("/players/delete");
    }
        await Player.findByIdAndDelete(player._id).then((res)=> console.log(res));
    req.flash("success", "player deleted successfully");
    res.redirect("players");

    }else{
      req.flash("error","username is incorrect");
        res.redirect("/players/delete");
    }
    
}));
module.exports = router;
