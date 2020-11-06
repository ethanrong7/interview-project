//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var experienceArray = [];

app.get("/", function(req, res){
    res.render("home");
});

app.get("/submit", function(req, res){
    res.render("submit");
})

app.post("/submit", function(req, res){
    const submitArray = {
        companyVar: req.body.company,
        companyRoleVar: req.body.companyRole
    }

    experienceArray.push(submitArray.companyVar, submitArray.companyRoleVar);
    res.render("submit");
    console.log("Array: " + experienceArray);
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
})