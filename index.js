const cors = require("cors");
const express = require("express");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
require("express-async-errors");

const app = express();

admin.initializeApp(functions.config().firebase);

app.use(cors());
app.use(express.json());

app.use("/users", require("./users"));

app.use((err, req, res, next) => res.status(400).json({ error: err }));

exports.api = functions.https.onRequest(app);
