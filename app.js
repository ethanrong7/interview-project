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
    
    function UndefinedString(bodyParser) {
        if (bodyParser != null) {
            bodyParser = bodyParser.replace(/'/g, "\\'");
        } 
        return bodyParser
    }

    try {
        var sql = "INSERT INTO application (`company_name`, `applied_position`, `year_app`, `type_of_interview1`, `interview1_questions`, `type_of_interview2`, `interview2_questions`, `type_of_interview3`, `interview3_questions`, `type_of_interview4`, `interview4_questions`, `yearly_salary`, `culture`) VALUES ('" + UndefinedString(req.body.company) + "', '" + UndefinedString(req.body.companyRole) + "', '" + req.body.yearpicker + "', '" + req.body.interviewType1 + "', '" + UndefinedString(req.body.interviewQuestion1) + "', '" + req.body.interviewType2 + "', '" + UndefinedString(req.body.interviewQuestion2) + "', '" + req.body.interviewType3 + "', '" + UndefinedString(req.body.interviewQuestion3) + "', '" + req.body.interviewType4 + "', '" + UndefinedString(req.body.interviewQuestion4) + "', '" + UndefinedString(req.body.salaryResp) + "', '" + UndefinedString(req.body.cultureResp) + "')";
        console.log(sql);
        connection.query(sql, function(err, result) {
            if (err) {
                throw (err);
            }
            console.log("Submitted application form");
        });
    }
    catch(err) {
        console.log(err);
    }
    res.render("submit");
});

app.get("/purpose", function(req,res) {
    res.render("purpose");
})

app.get("/company/:companyName/p:pageNumber", function(req, res) {
    const customCompanyName = req.params.companyName;
    const pageNumber = req.params.pageNumber;

    var companySql = "SELECT * FROM application WHERE company_name = '" + customCompanyName + "'";
    var interviewType = ["Assessment Centre", "Face to face interview", "Phone Interview", "Video interview"];

    connection.query(companySql, function(err,result) {
        if (err) {
            throw (err);
        }

        result = JSON.parse(JSON.stringify(result));

        if (result.some(item => item.company_name === customCompanyName) === true) {          
            console.log(customCompanyName + " was found!");
            res.render("company", {companyNameUrl: customCompanyName, resultSql: result, submitInterview: interviewType, pageNo: pageNumber});            
        } else {
            console.log(customCompanyName + " was not found.");
            res.render("notfound");
        }
        
    });
});

app.get("/company/:companyName/application/:applicationID", function(req, res) {
    const customCompanyName = req.params.companyName;
    const applicationID = req.params.applicationID;

    var applicationSql = "SELECT * FROM application WHERE application_id = '" + applicationID + "' AND company_name = '" + customCompanyName + "'";
    
    connection.query(applicationSql, function(err,result) {
        if (err) {
            throw (err);
        }

        result = JSON.parse(JSON.stringify(result));

        if (result.some(item => item.company_name === customCompanyName) === true && result.some(item => item.application_id.toString() === applicationID) === true) {          
            console.log("The application was found");
            res.render("application", {jobPosition: result[0].applied_position, companyNameUrl: customCompanyName, applicationYear: result[0].year_app, 
                firstInterview: result[0].type_of_interview1, firstInterviewQuestions: result[0].interview1_questions, 
                secondInterview: result[0].type_of_interview2, secondInterviewQuestions: result[0].interview2_questions,
                thirdInterview: result[0].type_of_interview3, thirdInterviewQuestions: result[0].interview3_questions,
                fourthInterview: result[0].type_of_interview4, fourthInterviewQuestions: result[0].interview4_questions,
                cultureEntry: result[0].culture});            
        } else {
            console.log(customCompanyName + " was not found.");
            res.render("notfound");
        }
        
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});