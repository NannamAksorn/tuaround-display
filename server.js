// server.js
const expressStaticGzip =  require("express-static-gzip");
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
// app.use(favicon(__dirname + '/public/favicon.png'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));// send the user to index html page inspite of the url
app.use("/", expressStaticGzip(path.resolve(__dirname, 'dist'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: function (res, path) {
    res.setHeader("Cache-Control", "public, max-age=31536000")
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.listen(port);