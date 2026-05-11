const mongoose = require("mongoose");

const matchSchema =  new mongoose.Schema({
    t1Name:{
        type:String,
        required: true
    },
    t1Runs:{
        type:Number,
        required: true
    },
    t1Wickets:{
        type:Number,
        required:true
    },
    t1Overs:{
        type: Number,
        required: true
    },
    t2Name:{
        type:String,
        required: true
    },
    t2Runs:{
        type:Number,
        required: true
    },
    t2Wickets:{
        type:Number,
        required:true
    },
    t2Overs:{
        type: Number,
        required: true
    },
    motm:{
        type: String,
        
    },
    date:{
        type:String,
        reduired:true
    }


});

let Matche = mongoose.model("Matche", matchSchema);
module.exports =Matche  ;
