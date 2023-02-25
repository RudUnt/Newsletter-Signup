// To get express module
const express = require("express");

// To get body-parser module which is used to get access of data posted by client
const bodyParser = require("body-parser");

require("dotenv").config();

const request = require("request");

const https = require("https");

// Getting access of express in app variable
const app = express();

// giving access of body-parser to app variable
app.use(bodyParser.urlencoded({ extended: true }));

// this used when we want to access our static files from so we need to do this and also make one public folder and put all static files inside it
app.use(express.static("public"));

// this is the home route when someone go to our website it will be loking first
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// this is used to access the data that was inserted by user inside the form from root page.
app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Data that we want to send on mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //   converting js objects into json data(plain data)
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "rudrauntwal:" + process.env.API_KEY,
  };

  //   making request to send data to mailchimp
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
}); // end of post method

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

// this is used to listen on mentioned port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on Port: 3000");
});
