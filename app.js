//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'xdxd',
    database: 'applicationDB'
});

connection.getConnection(function(err){
    if (err) {
        throw (err);
    } else {
        console.log("Successfully connected to mySQL");
    }
});

app.get("/", function(req, res){
    res.render("home");
});

app.get("/submit", function(req, res){
    res.render("submit");
})

app.post("/submit", function(req, res){
    var sql = "INSERT INTO application (`company_name`, `applied_position`, `year_app`, `type_of_interview1`, `interview1_questions`, `type_of_interview2`, `interview2_questions`, `type_of_interview3`, `interview3_questions`, `type_of_interview4`, `interview4_questions`, `yearly_salary`, `culture`) VALUES ('" + req.body.company + "', '" + req.body.companyRole + "', '" + req.body.yearpicker + "', '" + req.body.interviewType1 + "', '" + req.body.interviewQuestion1 + "', '" + req.body.interviewType2 + "', '" + req.body.interviewQuestion2 + "', '" + req.body.interviewType3 + "', '" + req.body.interviewQuestion3 + "', '" + req.body.interviewType4 + "', '" + req.body.interviewQuestion4 + "', '" + req.body.salaryResp + "', '" + req.body.cultureResp + "')";
    
    connection.query(sql, function(err, result) {
        if (err) {
            throw (err);
        }
        console.log("Submitted application form");
    });
    res.render("submit");
});

app.get("/purpose", function(req,res) {
    res.render("purpose");
})
/*
app.get("/company/:companyName", function(req, res) {
    const customCompanyName = req.params.companyName;

    var companySql = "SELECT company_name FROM application WHERE company_name = '" + customCompanyName + "'";

    connection.query(companySql, function(err,result) {
        if (err) {
            throw (err);
        }

        if (result.length != 0) {

            result = JSON.parse(JSON.stringify(result));
            
            console.log(customCompanyName + " was found!");
            res.render("company", {companyNameUrl: customCompanyName, companyPosition: "testing"});
            console.log(result.some(item => item.company_name === customCompanyName) + " working!!!!");
        } else {
            console.log(customCompanyName + " was not found.");
            res.render("notfound");
        }
        
    });
});
*/
app.get("/company/:companyName", function(req, res) {
    const customCompanyName = req.params.companyName;

    var companySql = "SELECT * FROM application WHERE company_name = '" + customCompanyName + "'";

    connection.query(companySql, function(err,result) {
        if (err) {
            throw (err);
        }

        result = JSON.parse(JSON.stringify(result));

        if (result.some(item => item.company_name === customCompanyName) === true) {          
            console.log(customCompanyName + " was found!");
            res.render("company", {companyNameUrl: customCompanyName, companyPosition: result[0].applied_position, yearlySalary: result[0].yearly_salary, yearApp: result[0].year_app});
        } else {
            console.log(customCompanyName + " was not found.");
            res.render("notfound");
        }
        
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});