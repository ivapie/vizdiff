var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var comparateImage = require('./comparateScreenShots')

/*

    Url
    localhost:3000

    Method
    Post

    Body
    {
        "screenshots": [
            "/imgs/1.png",
            "/imgs/2.png"
        ]
    }

*/


app.post('/', function (req, res ,next) {
    var arr = req.body.screenshots
    var screenShots = new comparateImage(arr).init()
    try {
        screenShots.then( data => {
            res.json(data);
        }).catch( err => {
            res.json(err);
        })
    } catch (error) {
        res.json(error);
    }
    next();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});