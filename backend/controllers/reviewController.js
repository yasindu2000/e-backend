import Review from "../model/review.js";

export function createReview(req, res) {
  const { name, comment, rating } = req.body;

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required to create a review",
    });
  }

  // Validation
  if (!name || !comment || !rating) {
    return res.status(400).json({
      message: "All fields (name, comment, rating) are required",
    });
  }

  // Create review object with user information
  const reviewData = {
    name: name,
    comment: comment,
    rating: rating,
    userId: req.user.email, // Using email as userId since that's what's in your JWT
    userEmail: req.user.email,
  };

  const review = new Review(reviewData);

  review
    .save()
    .then(() => {
      res.status(201).json({
        message: "Review created successfully",
        review: review,
      });
    })
    .catch((error) => {
      console.error("Error creating review:", error);
      res.status(500).json({
        message: "Failed to create review",
      });
    });
}

export function getReviews(req, res) {
  Review.find()
    .sort({ createdAt: -1 })
    .then((reviews) => {
      res.status(200).json(reviews);
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch reviews"
      });
    });
}

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required to update a review",
      });
    }

    // Find the review first
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.userEmail !== req.user.email) {
      return res.status(403).json({ 
        message: "You can only update your own reviews" 
      });
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ 
      message: "Failed to update review", 
      error: error.message 
    });
  }
};

export function deleteReview(req, res) {
  const { id } = req.params;

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required to delete a review",
    });
  }

  Review.findById(id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      // Check if the user owns this review
      if (req.user.role !== "admin" && review.userEmail !== req.user.email) {
        return res.status(403).json({
          message: "You can only delete your own reviews"
        });
      }

      // Delete the review
      return Review.findByIdAndDelete(id);
    })
    .then((deletedReview) => {
      if (!deletedReview) {
        return res.status(404).json({
          message: "Review not found"
        });
      }
      res.status(200).json({
        message: "Review deleted successfully"
      });
    })
    .catch((error) => {
      console.error("Error deleting review:", error);
      res.status(500).json({
        message: "Failed to delete review"
      });
    });
}