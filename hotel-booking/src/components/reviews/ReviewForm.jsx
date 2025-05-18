import { useState } from "react";
import { reviewService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import RatingStars from "./RatingStars";
import "./Reviews.css";

const ReviewForm = ({ roomId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("You must be logged in to leave a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      setError("Please enter a comment");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Sử dụng reviewService để gửi đánh giá
      await reviewService.createReview({
        roomId: parseInt(roomId),
        rating,
        comment,
      });

      setSuccess("Your review has been submitted and is pending approval");
      setRating(0);
      setComment("");
    } catch (error) {
      setError(
        "Error submitting review: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="review-login-prompt">
        <p>Please log in to leave a review</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Leave a Review</h3>

      {error && <div className="review-error">{error}</div>}
      {success && <div className="review-success">{success}</div>}

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating</label>
          <RatingStars
            initialRating={rating}
            onChange={(value) => setRating(value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="Share your experience with this room..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-review-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
