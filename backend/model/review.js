import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  }
}, {
  timestamps: true 
});

const Review = mongoose.model("reviews", reviewSchema);
export default Review;