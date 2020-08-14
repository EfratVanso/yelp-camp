var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  axios = require("axios").default,
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //__dirname = current path
seedDB();

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "It can be anything. it helps to encode the password",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//send the current user information to every rout
app.use(function(req, res, next){
  res.locals.currentUser = req.user;//it will be empty if no one has signed in
  next();
});
//=============
//  ROUTES
//=============
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
      res.render("campgrounds/index", { campgrounds: allCampgrounds,});
    }
  });
});

//CREATE - add new data to db
app.post("/campgrounds", function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };
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
  res.render("campgrounds/new");
});

//SHOw - show more info about campground
app.get("/campgrounds/:id", function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(req.params.id);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});
//==================================
//  COMMENTS ROUTES
//==================================
app.get("/campgrounds/:id/comments/new",isLoggedIn, function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.params.id);
      res.render("comments/new", { campground: foundCampground });
    }
  });
});
app.post("/campgrounds/:id/comments",isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds/");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//==================================
//  AUTH ROUTES
//==================================

//show register form
app.get("/register", function (req, res) {
  res.render("register");
});
//handle sign up logic
app.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

//show login form
app.get("/login", function (req, res) {
  res.render("login");
});
//handle login logic
app.post("/login",
  passport.authenticate("local", 
  {// middleware that check automatically if the user and password are correct
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
//handle logout
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//==================================

app.listen(3000, () => {
  console.log("yelp camp running on port 3000");
});
