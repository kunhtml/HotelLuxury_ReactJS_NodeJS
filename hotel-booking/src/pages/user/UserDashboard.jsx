import { useState, useEffect } from "react";
import { bookingService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
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
        }));

        setBookings(formattedBookings);
      } catch (error) {
        setError(
          "Error fetching bookings: " +
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
      return bookings.filter((booking) => booking.checkIn >= now);
    } else if (activeTab === "past") {
      return bookings.filter((booking) => booking.checkOut < now);
    } else if (activeTab === "cancelled") {
      return bookings.filter((booking) => booking.status === "cancelled");
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
      return "Cancelled";
    } else if (booking.checkOut < now) {
      return "Completed";
    } else if (booking.checkIn <= now && booking.checkOut >= now) {
      return "Active";
    } else {
      return "Upcoming";
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your bookings...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Bookings</h1>
        <p>Manage your hotel reservations</p>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`tab-button ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className={`tab-button ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {getFilteredBookings().length === 0 ? (
            <div className="no-bookings">
              <p>No {activeTab} bookings found.</p>
            </div>
          ) : (
            getFilteredBookings().map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.roomName}</h3>
                  <span className={`booking-status ${getStatusClass(booking)}`}>
                    {getStatusText(booking)}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-dates">
                    <div className="date-group">
                      <span className="date-label">Check-in</span>
                      <span className="date-value">
                        {format(booking.checkIn, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-group">
                      <span className="date-label">Check-out</span>
                      <span className="date-value">
                        {format(booking.checkOut, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="booking-info">
                    <div className="info-item">
                      <span className="info-label">Guests</span>
                      <span className="info-value">{booking.guests}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nights</span>
                      <span className="info-value">{booking.nights}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total</span>
                      <span className="info-value">${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="view-details-btn">View Details</button>
                  {booking.checkIn > new Date() &&
                    booking.status !== "cancelled" && (
                      <button className="cancel-booking-btn">
                        Cancel Booking
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
