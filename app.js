//jshint esversion:6
require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const bodyparser= require("body-parser");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");
const app=express();

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userschema= new mongoose.Schema({
    email: String,
    password: String 
});

userschema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User= new mongoose.model("User",userschema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const user1= new User({
        email: req.body.username,
        password: req.body.password
    })
    user1.save(function(err){
        if(err)
        {
           console.log(err); 
        }else
        {
            res.render("secrets");
        }
    });    
})

app.post("/login",function(req,res){
    const username= req.body.username;
    const password= req.body.password;

    User.findOne({email: username},function(err,founduser){
        if(err)
        {
            console.log(err);
        }else
        {
            if(founduser)
            {
                if(founduser.password===password)
                {
                    res.render("secrets");
                    console.log(password);
                }
            }
        }
    });
});

app.listen(3000,function(){
    console.log("the server has started on port 3000");
})