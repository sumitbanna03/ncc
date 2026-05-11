const express = require("express");
const router = express.Router();
const Matche = require("../models/matches.js");
const {isAuthenticated} = require("../authentic.js");

function asyncWrap(fn){
  return(
   function(req,res,next){
    fn(req,res,next).catch((err)=>next(err));
   }
  )};
router.get("/",asyncWrap( async(req,res,next)=>{

 const result = await Matche.find();
    res.render("matches.ejs", {matches:result});
}));
router.get("/new",isAuthenticated,(req,res)=>{
  if(res.locals.currUser.isAdmin){
    res.render("newMatch.ejs");
    }else{
      req.flash("error","you are not Admin to add match");
      res.redirect("/");
    }
})
router.post("/",isAuthenticated, asyncWrap(async (req, res,next) => {
  if(!res.locals.currUser.isAdmin){
    req.flash("error","you are not Admin to add match");
      res.redirect("/");
    }
    await Matche.create({
      t1Name: req.body.t1Name + ".",
      t1Runs: req.body.t1R,
      t1Wickets: req.body.t1W,
      t1Overs: req.body.t1O,
      t2Name: req.body.t2Name + ".",
      t2Runs: req.body.t2R,
      t2Wickets: req.body.t2W,
      t2Overs: req.body.t2O,
      motm: req.body.motm,
      date: req.body.date,

    });
    req.flash("success","New match added");
    res.redirect("/matches");
}));

router.get('/search', asyncWrap(async(req, res,next) => {
  const search = req.query.q;
  if (!search) {
    return res.json([]);
  }
 const results =  await Matche.find({
 $or: [
    { t1Name: { $regex:search, $options: "i" } },
    { t2Name: { $regex: search, $options: "i" } }
  ]
});
    res.json(results);
  }));

  router.delete("/:id",isAuthenticated,asyncWrap(async(req,res,next)=>{
    const {id} = req.params;
    Matche.findByIdAndDelete(id).then((res)=> console.log(res));
    res.redirect("/matches");
  }));
module.exports = router;
