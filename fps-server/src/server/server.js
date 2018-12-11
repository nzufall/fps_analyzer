const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const port = require("../../config/server.config").port;
const dbLocation = require("../../config/db.config").path;

// Get to DB location
// TODO: Make this more easily handled
const dbPath = path.join(__dirname, "..", "..", dbLocation);
let db = new sqlite3.Database(dbPath);

// Boiler plate to allow for the react app to call a localhost api
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let reactAppPath = path.join(__dirname, "..", "..", "build");
app.use(express.static(reactAppPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(reactAppPath, "index.html"));
});

app.get("/fps", (req, res) => {
  db.serialize(() => {
    db.all("SELECT AVG(fps) FROM sample", (err, row) => {
      returnData = {};
      returnData.averageFPS = row[0]["AVG(fps)"];
      res.send(returnData);
    });
  });
});

app.get("/acts", (req, res) => {
  db.serialize(() => {
    db.all("SELECT DISTINCT act FROM collection", (err, rows) => {
      let returnData = {};
      returnData.acts = [];
      rows.forEach(row => {
        returnData.acts.push(row.act);
      });

      res.send(returnData);
    });
  });
});

app.get("/acts/:actID", (req, res) => {
  db.serialize(() => {
    db.all(
      `SELECT DISTINCT world FROM collection WHERE act LIKE '${req.params
        .actID}'`,
      (err, rows) => {
        let returnData = {};
        returnData.worlds = [];
        rows.forEach(row => {
          returnData.worlds.push(row.world);
        });

        res.send(returnData);
      }
    );
  });
});

app.get("/acts/:actID/fps", (req, res) => {
  db.serialize(() => {
    db.all(
      `SELECT AVG(fps) FROM sample JOIN collection ON sample.collectionID = collection.ID WHERE collection.act LIKE '${req
        .params.actID}'`,
      (err, row) => {
        returnData = {};
        returnData.averageFPS = row[0]["AVG(fps)"];
        res.send(returnData);
      }
    );
  });
});

app.get("/acts/:actID/worlds/:worldID/fps", (req, res) => {
  db.serialize(() => {
    db.all(
      `SELECT AVG(fps) FROM sample JOIN collection ON sample.collectionID = collection.ID WHERE collection.act LIKE '${req
        .params.actID}' AND collection.world LIKE '${req.params.worldID}'`,
      (err, row) => {
        returnData = {};
        returnData.averageFPS = row[0]["AVG(fps)"];
        res.send(returnData);
      }
    );
  });
});

// Startup Server in an accessible way
app.listen(port, () => console.log(`Server listening on port ${port}!`));

// Export Server for testing purposes
module.exports = app;
