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
        var sql = "INSERT INTO application (`company_name`, `applied_position`, `year_app`, `type_of_interview1`, `interview1_questions`, `type_of_interview2`, `interview2_questions`, `type_of_interview3`, `interview3_questions`, `type_of_interview4`, `interview4_questions`, `yearly_salary`, `culture`) VALUES ('" + req.body.company + "', '" + req.body.companyRole + "', '" + req.body.yearpicker + "', '" + req.body.interviewType1 + "', '" + req.body.interviewQuestion1 + "', '" + req.body.interviewType2 + "', '" + req.body.interviewQuestion2 + "', '" + req.body.interviewType3 + "', '" + req.body.interviewQuestion3 + "', '" + req.body.interviewType4 + "', '" + req.body.interviewQuestion4 + "', '" + req.body.salaryResp + "', '" + req.body.cultureResp + "')";
        
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