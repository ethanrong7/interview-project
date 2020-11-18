//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var applicationNo = 1;

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'xd',
    database: 'applicationDB'
});

app.get("/", function(req, res){

    res.render("home");
});

app.get("/submit", function(req, res){
    res.render("submit");
})

app.post("/submit", function(req, res){

    connection.getConnection(function(err){
        if (err) {
            throw (err);
        }

        console.log("connected");
        var sql = "INSERT INTO application (`company_name`, `applied_position`, `year_app`) VALUES ('" + req.body.company + "', '" + req.body.companyRole + "', '" + req.body.yearpicker + "')";
        connection.query(sql, function(err, result) {
            if (err) {
                throw (err);
            }
            console.log("submitted");
        })
    });
    applicationNo = applicationNo + 1;
    res.render("submit");
    
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
})