//jshint esversion:6
require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
//const secret="ramiyaWastaBai";
console.log(process.env.API);
// userSchema.plugin(encrypt,{secret:secret,encryptfields:["password"]});
userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });
const User=mongoose.model("User",userSchema);
app.get("/",(req,res)=>{
    res.render("home");

});
app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    if (!password) {
        console.log("Password is required");
        return res.redirect("/register");
    }

    const newUser=new User({
        email:username,
        password:password
    });
    newUser.save()
    .then(() => {
        res.render("secrets");
    })
    .catch((err) => {
        console.log(err);
    });
});
// ****************** MongooseError: Model.findOne() no longer accepts a callback******************

// app.post("/login", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     // Find the user with the provided username in the database
//     User.findOne({ email: username }, (err, foundUser) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/login");  // Redirect to login page in case of an error
//         } else {
//             if (foundUser) {
//                 // Check if the provided password matches the stored password
//                 if (foundUser.password === password) {
//                     res.render("secrets");  // Successful login, render secrets page
//                 } else {
//                     res.redirect("/login");  // Password does not match, redirect to login page
//                 }
//             } else {
//                 res.redirect("/login");  // User not found, redirect to login page
//             }
//         }
//     });
// });

// **********************************************************************************************
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        
        const foundUser = await User.findOne({ email: username });//here by this command by looking at email we locate the document in the datbase
        if (foundUser) {
           
            if (foundUser.password === password) {
                console.log(foundUser.password);//By doing the console.log() we can find the password the way the mongoose-encrypt work it will encrypt when you call save and it will decrypt when you call find
                
                res.render("secrets");  
            } else {
                res.redirect("/login"); 
            }
        } else {
            
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/login");  
    }
});

app.listen(3000,function(){
    console.log("server started on port 3000:")
});


