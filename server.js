const express = require("express");
const app = express();
//
app.use(express.static(__dirname + '/View'));
// //Store all HTML files in view folder.
app.use(express.static(__dirname + '/Script'));
// //Store all JS and CSS in Scripts folder.

app.get('/',function(req,res){
  res.render('index.html');
  //It will find and locate index.html from View or Scripts
});

app.listen(3000);

console.log("Running at Port 3000");
