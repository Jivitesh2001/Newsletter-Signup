const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public")); // for sending static files like css and images
app.use(express.urlencoded({ extended: true })); //for body-parser

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    console.log(fName + "\n" + lName + "\n" + email);
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]

    };
    const url = 'https://us6.api.mailchimp.com/3.0/lists/list-id';
    const options = {
        method: "post",
        auth: "jivitesh :api-key"
    }


    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });


    });

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
})

