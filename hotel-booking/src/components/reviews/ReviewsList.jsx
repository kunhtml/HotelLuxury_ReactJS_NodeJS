import { useState, useEffect } from "react";
import { reviewService } from "../../services/api";
import RatingStars from "./RatingStars";
import { format } from "date-fns";
import "./Reviews.css";

const ReviewsList = ({ roomId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Use reviewService to get reviews by roomId
        const reviewsData = await reviewService.getReviewsByRoomId(roomId);

        // Calculate average rating
        let totalRating = 0;
        reviewsData.forEach((review) => {
          totalRating += review.rating;
          // Convert createdAt from string to Date object if needed
          review.createdAt = new Date(review.created_at || review.createdAt);
        });

        setReviews(reviewsData);
        setAverageRating(
          reviewsData.length > 0 ? totalRating / reviewsData.length : 0
        );
      } catch (error) {
        setError(
          "Error fetching reviews: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [roomId]);

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-summary">
        <h3>Guest Reviews</h3>
        <div className="average-rating">
          <RatingStars
            initialRating={Math.round(averageRating)}
            readOnly={true}
          />
          <span className="rating-value">{averageRating.toFixed(1)}</span>
          <span className="reviews-count">({reviews.length} reviews)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <h4>{review.userName}</h4>
                  <span className="review-date">
                    {format(review.createdAt, "MMMM d, yyyy")}
                  </span>
                </div>
                <RatingStars initialRating={review.rating} readOnly={true} />
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
