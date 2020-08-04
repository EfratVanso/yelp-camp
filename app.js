var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    axios = require("axios").default,
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

// Campground.create({
//     name:"Dreams Vacation Rentals",
//     image:"https://cf.bstatic.com/images/hotel/max1280x900/154/154488931.jpg",
//     description:"One of our top picks in Kissimmee.    Located in Kissimmee, Dreams Vacation Rentals provides free WiFi, and guests can enjoy an outdoor swimming pool, a fitness centre and a tennis court.    All units here are air-conditioned and feature a flat-screen TV, a living room with a sofa, a well-equipped kitchen and a private bathroom with hot tub, a hairdryer and free toiletries."})

//var Campground = mongoose.model("Campground", campgroundSchema);

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
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE - add new data to db
app.post("/campgrounds", function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description:desc };
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

//SHOw - show more info about campground
app.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
            console.log(req.params.id)
            res.render("show", {campground: foundCampground});
        }
    })
  });

app.listen(3000, () => {
  console.log("yelp camp running on port 3000");
});
