const express = require('express');
const app = express();
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
    // res.send("user has entered " + req.body.fname + " " + req.body.lname + " " + req.body.ename);

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
        auth: "abhi:3d670fb80d63150e989a47b0384a44fa-us5"
    }
    const request = https.request(url, option, function (response) {
        console.log(response.statusCode);

        // if (response.statusCode < 200 || response.statusCode >= 300) {
        //     return reject(new Error('statusCode=' + response.statusCode));
        // }

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
            res.write("<h1>Temperature in " + name + " is " + temp + " degrees</h1>")
            res.write("<p>Weather desciption is " + weatherdesc + ".</p>")
            res.write("<img src = " + imageurl + ">")
            res.send();
        })
    })
});
app.post("/failure.html", function(req, res){
    res.redirect("/signup");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("HI");
});