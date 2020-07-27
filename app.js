const express = require('express');
const app = express();
app.set("view engine", "ejs");
var axios = require('axios').default;

app.get("/",function(req, res){
    res.render("landing")
});
app.listen(3000, () => {
    console.log('yelp camp running on port 3000');
});