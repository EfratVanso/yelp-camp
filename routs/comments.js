var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment");
//==================================
//  COMMENTS ROUTES
//==================================
//open new comment form
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
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

//handle adding new comment
router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
