const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var axios = require("axios").default;
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name:"Granite Heel",
//     image:"https://q-xx.bstatic.com/xdata/images/hotel/max500/166833903.jpg?k=b92acc7258f01c29c6342161aa882ebaed025311daa44e9f66fee2775f638761&o="
// },function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("CREATED");
//         console.log(campground);
//     }
// });


app.get("/", function (req, res) {
    res.render("landing");
});
app.get("/campgrounds", function (req, res) {
    //get all campground from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds", { campgrounds: allCampgrounds });
        }
    });
});
app.post("/campgrounds", function (req, res) {
    //get data from form and add to campgrounds array
    //redirect back to campground page
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name:name, image:image};
    //campgrounds.push(newCampground);
    //create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else{
            console.log(newlyCreated);
            res.redirect("/campgrounds"); // the default is to GET rout
        }
    });

});
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(3000, () => {
    console.log("yelp camp running on port 3000");
});
