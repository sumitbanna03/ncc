const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;
const playerSchema =  new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
   
    role:{
        type:String,
        required: true
    },
    batting:{
        type:String,
        required:true
    },
    bowling:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    jerseyNo:{
        type: Number,
        required:true
    },
    img:{
        url: String,
        filename:String,
    },
    isAdmin:{
        type: Boolean,
        required: true
    }
  

});
playerSchema.plugin(passportLocalMongoose);
let Player = mongoose.model("Player", playerSchema);
module.exports = Player ;
