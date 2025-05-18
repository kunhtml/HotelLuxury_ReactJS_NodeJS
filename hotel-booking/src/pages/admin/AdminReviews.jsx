import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaCheck, FaTimes, FaStar } from "react-icons/fa";
import { format } from "date-fns";
import { reviewService } from "../../services/api";
import "./AdminDashboard.css";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsData = await reviewService.getAllReviews();

        // Format dates
        const formattedReviews = reviewsData.map((review) => ({
          ...review,
          formattedDate: format(
            new Date(review.created_at),
            "dd/MM/yyyy HH:mm"
          ),
        }));

        setReviews(formattedReviews);
        setFilteredReviews(formattedReviews);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu đánh giá");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    // Lọc đánh giá dựa trên filter và searchTerm
    let result = [...reviews];

    // Áp dụng filter
    if (filter !== "all") {
      result = result.filter((review) => review.status === filter);
    }

    // Áp dụng tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (review) =>
          review.room_name?.toLowerCase().includes(term) ||
          review.user_name?.toLowerCase().includes(term) ||
          review.comment?.toLowerCase().includes(term)
      );
    }

    setFilteredReviews(result);
  }, [reviews, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openStatusModal = (review, status) => {
    setSelectedReview(review);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedReview(null);
    setNewStatus("");
  };

  const confirmStatusChange = async () => {
    if (!selectedReview || !newStatus) return;

    try {
      await reviewService.updateReviewStatus(selectedReview.id, newStatus);

      // Update local state
      const updatedReviews = reviews.map((review) => {
        if (review.id === selectedReview.id) {
          return { ...review, status: newStatus };
        }
        return review;
      });

      setReviews(updatedReviews);
      closeStatusModal();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      console.error("Error updating review status:", err);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Đang Chờ";
      case "approved":
        return "Đã Duyệt";
      case "rejected":
        return "Đã Từ Chối";
      default:
        return status;
    }
  };

  // Hiển thị sao đánh giá
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu đánh giá...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-reviews">
      <div className="admin-header">
        <h1>Quản Lý Đánh Giá</h1>
      </div>

      <div className="review-filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Tất Cả Đánh Giá</option>
            <option value="pending">Đang Chờ</option>
            <option value="approved">Đã Duyệt</option>
            <option value="rejected">Đã Từ Chối</option>
          </select>
        </div>

        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="reviews-table-container">
        {filteredReviews.length === 0 ? (
          <div className="no-data">Không tìm thấy đánh giá nào</div>
        ) : (
          <table className="reviews-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phòng</th>
                <th>Người Dùng</th>
                <th>Đánh Giá</th>
                <th>Nội Dung</th>
                <th>Ngày</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.room_name}</td>
                  <td>{review.user_name}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td className="comment-cell">{review.comment}</td>
                  <td>{review.formattedDate}</td>
                  <td>
                    <span className={`status-badge ${review.status}`}>
                      {getStatusLabel(review.status)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {review.status === "pending" && (
                      <>
                        <button
                          className="approve-button"
                          onClick={() => openStatusModal(review, "approved")}
                        >
                          <FaCheck /> Duyệt
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => openStatusModal(review, "rejected")}
                        >
                          <FaTimes /> Từ Chối
                        </button>
                      </>
                    )}

                    {review.status === "approved" && (
                      <button
                        className="reject-button"
                        onClick={() => openStatusModal(review, "rejected")}
                      >
                        <FaTimes /> Từ Chối
                      </button>
                    )}

                    {review.status === "rejected" && (
                      <button
                        className="approve-button"
                        onClick={() => openStatusModal(review, "approved")}
                      >
                        <FaCheck /> Duyệt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal xác nhận thay đổi trạng thái */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác Nhận Thay Đổi Trạng Thái</h2>
            <div className="modal-container">
              <p>
                Bạn có chắc chắn muốn{" "}
                <strong>
                  {newStatus === "approved" ? "duyệt" : "từ chối"}
                </strong>{" "}
                đánh giá này?
              </p>
              <div className="review-preview">
                <div>
                  <strong>Phòng:</strong> {selectedReview?.room_name}
                </div>
                <div>
                  <strong>Người dùng:</strong> {selectedReview?.user_name}
                </div>
                <div>
                  <strong>Đánh giá:</strong> {selectedReview?.rating}/5
                </div>
                <div>
                  <strong>Nội dung:</strong> {selectedReview?.comment}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeStatusModal}>
                Hủy
              </button>
              <button
                className={
                  newStatus === "approved" ? "approve-button" : "reject-button"
                }
                onClick={confirmStatusChange}
              >
                {newStatus === "approved" ? "Duyệt" : "Từ Chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
