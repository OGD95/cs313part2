var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://planneruser:planneruser@localhost:5432/plannerplus";
const pool = new Pool({ connectionString: connectionString, ssl: process.env.DATABASE_URL ? true : false, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : { rejectUnauthorized: true } });

app.set("port", (process.env.PORT || 5000));

app.get("/getAccount", getAccount);
app.get("/", function (req, res) {
    res.sendFile('views/pages/homePage.html', { root: __dirname });
});
app.get("/createEvent", function (req, res) {
    res.sendFile('views/pages/createEvent.html', { root: __dirname });
});
app.post("/eventSuccesfullyCreated", function(req, res){
    console.log("made it Here!", req);
});

app.listen(app.get("port"), function () {
    console.log("Now listening for connections on port: ", app.get("port"));
});

function createEvent(req, res) {
    console.log("made it Here!", req);
    // var accountId = 1;
    // var eventTitle = req.query.eventTitle;
    // var eventDateTime = req.query.eventDate + req.query.startTime;
    // var eventEndTime = req.query.endTime;
    // var meetingLocation = req.query.meetingLocation;
    // var eventPrivacy = req.query.privacyLevel.value;
    // var eventDetails = req.query.eventDetails;

    // console.log(accountId, eventTitle, eventDateTime, eventEndTime);

    // var sql = "INSERT INTO event(accountId, eventTitle, eventDateTime, eventEndTime, meetingLocation, eventPrivacy, eventDetails) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    // var params = [accountId, eventTitle, eventDateTime, 
    //               eventEndTime, meetingLocation, eventPrivacy, 
    //               eventDetails];
    // pool.query(sql, params, function(err, result){
    //     if (err){
    //         console.log("An error with the database occurred");
    //         console.log(err);
    //         callback(err, null);
    //     }

    //     console.log("Found DB result: " + JSON.stringify(result.rows));
    //     callback(null, result.rows);
    // })
    //res.sendFile('views/pages/creationStatus.html', { root: __dirname});

}

function getAccount(req, res) {
    console.log("getting account information");

    var accountId = req.query.accountId;
    console.log("Retrieving person with id: ", accountId);

    getAccountFromDB(accountId, function (error, result) {
        console.log("Back from the database with result: ", result);

        if (error || result == null || result.length != 1) {
            res.status(500).json({ sucess: false, data: error });
        } else {
            res.json(result[0]);
        }
    });
}

function getAccountFromDB(accountId, callback) {
    console.log("getPersonFromDB called with accountId: ", accountId);

    var sql = "SELECT * FROM account WHERE accountId = $1::int";
    var params = [accountId];

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("An error with the database occurred");
            console.log(err);
            callback(err, null);
        }

        console.log("Found DB result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}