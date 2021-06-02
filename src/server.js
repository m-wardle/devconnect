var express = require("express");
var app = express();
var PORT = process.env["PORT"] || 5000;
app.listen(PORT, function () { return console.log("Server started on port " + PORT); });
