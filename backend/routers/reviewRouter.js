import express from "express"
import { createReview, deleteReview, getReviews, updateReview } from "../controllers/reviewController.js"



const reviewRouter = express.Router()

reviewRouter.post("/", createReview);
reviewRouter.get("/", getReviews);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);



export default reviewRouter
