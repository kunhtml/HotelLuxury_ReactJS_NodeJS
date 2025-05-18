import { useState, useEffect } from "react";
import { bookingService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { FaEye, FaTimes } from "react-icons/fa";
import "./UserDashboard.css";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        // Use bookingService to get user bookings
        const bookingsData = await bookingService.getUserBookings();

        // Convert date strings to Date objects
        const formattedBookings = bookingsData.map((booking) => ({
          ...booking,
          checkIn: new Date(booking.check_in || booking.checkIn),
          checkOut: new Date(booking.check_out || booking.checkOut),
          formattedCheckIn: format(new Date(booking.check_in || booking.checkIn), "dd/MM/yyyy"),
          formattedCheckOut: format(new Date(booking.check_out || booking.checkOut), "dd/MM/yyyy"),
        }));

        setBookings(formattedBookings);
      } catch (error) {
        setError(
          "Lỗi khi tải dữ liệu đặt phòng: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  const getFilteredBookings = () => {
    const now = new Date();

    if (activeTab === "upcoming") {
      return bookings.filter((booking) => booking.checkIn >= now && booking.status !== "cancelled");
    } else if (activeTab === "past") {
      return bookings.filter((booking) => booking.checkOut < now && booking.status !== "cancelled");
    } else if (activeTab === "cancelled") {
      return bookings.filter((booking) => booking.status === "cancelled");
    } else if (activeTab === "active") {
      return bookings.filter((booking) => 
        booking.checkIn <= now && 
        booking.checkOut >= now && 
        booking.status !== "cancelled"
      );
    }

    return bookings;
  };

  const getStatusClass = (booking) => {
    const now = new Date();

    if (booking.status === "cancelled") {
      return "status-cancelled";
    } else if (booking.checkOut < now) {
      return "status-completed";
    } else if (booking.checkIn <= now && booking.checkOut >= now) {
      return "status-active";
    } else {
      return "status-upcoming";
    }
  };

  const getStatusText = (booking) => {
    const now = new Date();

    if (booking.status === "cancelled") {
      return "Đã Hủy";
    } else if (booking.checkOut < now) {
      return "Đã Hoàn Thành";
    } else if (booking.checkIn <= now && booking.checkOut >= now) {
      return "Đang Diễn Ra";
    } else {
      return "Sắp Tới";
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await bookingService.updateBookingStatus(bookingToCancel.id, "cancelled");
      
      // Update local state
      const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingToCancel.id) {
          return { ...booking, status: "cancelled" };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error) {
      setError("Lỗi khi hủy đặt phòng: " + (error.response?.data?.message || error.message));
    }
  };

  const cancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && !bookings.length) {
    return <div className="loading">Đang tải dữ liệu đặt phòng...</div>;
  }

  return (
    <div className="user-bookings">
      <div className="bookings-header">
        <h1>Phòng Đã Đặt</h1>
        <p>Quản lý các đặt phòng của bạn</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="bookings-tabs">
        <button
          className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Sắp Tới
        </button>
        <button
          className={`tab-button ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Đang Diễn Ra
        </button>
        <button
          className={`tab-button ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Đã Qua
        </button>
        <button
          className={`tab-button ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Đã Hủy
        </button>
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất Cả
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>Bạn chưa có đặt phòng nào.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {getFilteredBookings().length === 0 ? (
            <div className="no-bookings">
              <p>Không tìm thấy đặt phòng nào {activeTab !== "all" ? `trong mục "${activeTab}"` : ""}.</p>
            </div>
          ) : (
            getFilteredBookings().map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.room_name || booking.roomName}</h3>
                  <span className={`booking-status ${getStatusClass(booking)}`}>
                    {getStatusText(booking)}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-dates">
                    <div className="date-group">
                      <span className="date-label">Nhận Phòng</span>
                      <span className="date-value">
                        {booking.formattedCheckIn}
                      </span>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-group">
                      <span className="date-label">Trả Phòng</span>
                      <span className="date-value">
                        {booking.formattedCheckOut}
                      </span>
                    </div>
                  </div>

                  <div className="booking-info">
                    <div className="info-item">
                      <span className="info-label">Khách</span>
                      <span className="info-value">{booking.guests || 2}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Đêm</span>
                      <span className="info-value">
                        {calculateNights(booking.checkIn, booking.checkOut)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tổng Tiền</span>
                      <span className="info-value">
                        ${parseFloat(booking.total_price || booking.totalPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="view-details-btn">
                    <FaEye /> Xem Chi Tiết
                  </button>
                  {booking.checkIn > new Date() &&
                    booking.status !== "cancelled" && (
                      <button 
                        className="cancel-booking-btn"
                        onClick={() => handleCancelClick(booking)}
                      >
                        <FaTimes /> Hủy Đặt Phòng
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal xác nhận hủy đặt phòng */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác Nhận Hủy Đặt Phòng</h2>
            <div className="modal-container">
              <p>
                Bạn có chắc chắn muốn hủy đặt phòng <strong>{bookingToCancel?.room_name || bookingToCancel?.roomName}</strong>?
              </p>
              <p>
                <strong>Ngày nhận phòng:</strong> {bookingToCancel?.formattedCheckIn}<br />
                <strong>Ngày trả phòng:</strong> {bookingToCancel?.formattedCheckOut}
              </p>
              <p className="warning">
                Lưu ý: Việc hủy đặt phòng có thể phải chịu phí hủy tùy theo chính sách của khách sạn.
              </p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelModal}>
                Quay Lại
              </button>
              <button className="delete-button" onClick={confirmCancel}>
                Xác Nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
