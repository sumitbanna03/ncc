const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
if(process.env.NODE_ENV != "production"){
require('dotenv').config(); // Load your API keys from a .env file
};
const MyError = require("./MyError.js");
const app = express();
const port = 1600;
const ejsMate = require("ejs-mate");
const Matche = require("./models/matches.js");
const Player = require("./models/players.js");
const {playerSchema} = require("./schema.js");
const {isAuthenticated} = require("./authentic.js");
const dbUrl = process.env.ATLAS_DB_URL;
//"mongodb://127.0.0.1:27017/ncc"
const  playerRouts = require("./routs/players.js");
const  matchRouts = require("./routs/matches.js");
const profileRouts = require("./routs/profile.js");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport =  require("passport");
const localStrategy = require("passport-local");
const {saveUrl} = require("./authentic.js");
const methodOverride = require("method-override");
const { profile } = require("console");
// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("123456"));

const store =  MongoStore.create({
    mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },    
    touchAfter: 24 * 3600 // time period in seconds
  });
store.on("error",()=>{
  console.log("ERROR in mongostore! ", err);
});

app.use(session({
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  }
}));

app.use(methodOverride("_method"));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Player.authenticate()));
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());
// static + view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);



function asyncWrap(fn){
  return(
   function(req,res,next){
    fn(req,res,next).catch((err)=>next(err));
   }
  );
}
main().then((res) =>{
  console.log("Connected to DB");
}).catch((err) =>{
  console.log("mongodb connection error");
  console.log(err);
  
})
async function main() {
    await mongoose.connect(dbUrl);
}; 

app.listen(port , ()=>{
    console.log("listenning on port ",port);

});
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; 
  next();
})

app.get("/",asyncWrap(async(req,res,next)=>{
  const pCount = await Player.countDocuments();
  const mCount = await Matche.countDocuments();
  
    res.render("homepage.ejs",{pCount,mCount});
}));

app.get("/login", (req,res)=>{
  res.render("login.ejs");
 
});
app.post("/login", saveUrl,
  passport.authenticate("local", { 
    failureRedirect: "/login",
    failureFlash: true 
  }),
  (req, res) => {
    // Passport has already attached the user to req.user here
    console.log("Login Successful! User is:", req.user.username);
    req.flash("success", "Welcome back to NCC!");
    const redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
  }
);
app.get("/logout",isAuthenticated,(req,res)=>{
  req.logout((err)=>{
    if(err)
      return next(err);
    req.flash("success", "Logged Out!");
    res.redirect("/");
  })
})
app.use("/profile", profileRouts);
app.use("/players", playerRouts);
app.use("/matches", matchRouts);


app.get("/getcookie",(req,res)=>{
  res.cookie("greet","hello",{signed:true});
  res.redirect("/usecookie");



});
app.get("/usecookie",(req,res)=>{
  let {name="any"}= req.cookies;
  console.log(req.signedCookies);
  res.send(" ");
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

//Error Handler
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(404).end(); 
});
app.all("/*splat", (req, res, next) => {
    next(new MyError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
  let {status=500, message="Internal server error"}= err;
  console.log(err);
    res.status(status).render("err",{message,status});

});

   // Add Player
// const player = new Player({
//   name:"Aditya Chouhan.",
//   username:"addi",
//   role:"All-Rounder",
//   batting:"Right-handed",
//   bowling:"Right Arm fast",
//   jerseyNo:21,
//   age:45,
//   img:{url:"https://res.cloudinary.com/drupkujzt/image/upload/v1777918519/ncc_players/vrbjgbtbsst9addhvswt.jpg",filename:""},
//   isAdmin:false,
// })
// const registeredplayer = Player.register(player,"12345678").then((res)=> console.log(res));
// DELETE FROM MONGODB  
  // Player.findByIdAndDelete('69fb10475ac9e1401a6c16e5').then((res)=> console.log(res));
  // Player.deleteMany({}).then(res => console.log(res));
   //Matche.deleteMany({}).then(res => console.log(res));
