const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var axios = require("axios").default;
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});
var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function (req, res) {
  res.render("landing");
});

//INDEX - show all campground
app.get("/campgrounds", function (req, res) {
  //get all campground from db
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE - add new data to db
app.post("/campgrounds", function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
  //create new campground and save to db
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      //redirect back to campground page
      res.redirect("/campgrounds"); // the default is to GET rout
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function (req, res) {
  res.render("new");
});

app.listen(3000, () => {
  console.log("yelp camp running on port 3000");
});
