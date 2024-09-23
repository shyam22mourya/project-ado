const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleWare.js");


const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const { merge } = require("./listing.js");



// Reviews  
// post Route

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New reviews Created ! ");

    res.redirect(`/listings/${listing._id}`)

}));

// Delte route reviws
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params; // Correct param destructuring
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review deleted  ! ");

    res.redirect(`/listings/${id}`);
}));


module.exports = router; 