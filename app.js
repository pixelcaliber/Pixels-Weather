const express = require('express');
const app = express();
require('dotenv').config();
app.set('view engine', 'ejs');

const https = require('https');
const request = require('request');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('path'));

app.get('/', function (req, res) {

    res.sendFile(__dirname + "/index.html");
});
app.get("/signup", function (req, res){
    res.sendFile(__dirname + "/signupindex.html");

});
//newsletter..
app.post("/signup", function (req, res) {
    console.log(req.body);

    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.ename;
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };
    var jsondata = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/5cd2749880"
    const option = {
        method: "POST",
        auth: process.env.MY_VARIABLE
    }
    const request = https.request(url, option, function (response) {
        console.log(response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata);

    request.end();
})

//newsletter..

app.post('/', function (req, res){

    var name = req.body.cityname;
    console.log(name);

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&units=metric&appid=b592a98d4c0e2a07b4cd4f241ede84b9#";
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {

            weatherdata = JSON.parse(data);
            const icon = weatherdata.weather[0].icon;
            const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            const temp = weatherdata.main.temp;

            console.log(imageurl)
            const weatherdesc = weatherdata.weather[0].description
            console.log(weatherdesc)

            var today = new Date();
            var crr_day = today.getDay();
            var crr_date = today.getDate();
            var crr_year = today.getFullYear();
            var month = today.getMonth() + 1;
            var day = "";
            if (crr_day === 6 || crr_day === 0) {
                day = "Weekend / Holiday";
            }
            else {
                day = "Weekday";
            }
            res.render("lists", 
            {
                kindofday: day,
                temperature: temp,
                nameofcity: name,
                wdescription: weatherdesc,
                imagelink: imageurl,
                monthname: month,
                year : crr_year,
                date: crr_date
            });
            //commments..
            // res.write("<h1>Temperature in " + name + " is " + temp + " degrees</h1>")
            // res.write("<p>Weather desciption is " + weatherdesc + ".</p>")
            // res.write("<img src = " + imageurl + ">")
            // res.send();
        })
    })
});
app.post("/failure.html", function(req, res){
    res.redirect("/signup");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Site is running");
});
