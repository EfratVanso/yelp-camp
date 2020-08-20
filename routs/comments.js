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
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save the comment
          comment.save();

          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//comments edit rout
router.get("/campgrounds/:id/comments/:comment_id/edit", function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//comments edit rout
router.put("/campgrounds/:id/comments/:comment_id", function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//comments destroy rout
router.delete("/campgrounds/:id/comments/:comment_id", function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
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
