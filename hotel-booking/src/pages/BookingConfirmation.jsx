import { useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="booking-error">
        <h2>Booking Information Not Found</h2>
        <p>There was an error retrieving your booking information.</p>
        <Link to="/booking" className="back-btn">Return to Booking</Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h1>Booking Confirmed!</h1>
          <p>Thank you for choosing Luxury Hotel</p>
        </div>
        
        <div className="confirmation-details">
          <h2>Booking Details</h2>
          
          <div className="detail-section">
            <h3>Guest Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{booking.firstName} {booking.lastName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{booking.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{booking.phone}</span>
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Stay Information</h3>
            <div className="detail-row">
              <span className="detail-label">Room:</span>
              <span className="detail-value">{booking.roomName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Check-in:</span>
              <span className="detail-value">{format(new Date(booking.checkIn), 'MMMM d, yyyy')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Check-out:</span>
              <span className="detail-value">{format(new Date(booking.checkOut), 'MMMM d, yyyy')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nights:</span>
              <span className="detail-value">{booking.nights}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Guests:</span>
              <span className="detail-value">{booking.guests}</span>
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Payment Information</h3>
            <div className="detail-row">
              <span className="detail-label">Room Rate:</span>
              <span className="detail-value">${booking.roomPrice} per night</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total:</span>
              <span className="detail-value total-price">${booking.totalPrice}</span>
            </div>
          </div>
          
          {booking.specialRequests && (
            <div className="detail-section">
              <h3>Special Requests</h3>
              <p>{booking.specialRequests}</p>
            </div>
          )}
        </div>
        
        <div className="confirmation-footer">
          <p>A confirmation email has been sent to {booking.email}</p>
          <p>Booking Reference: <strong>BK{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</strong></p>
          <div className="action-buttons">
            <Link to="/" className="home-btn">Return to Home</Link>
            <button className="print-btn" onClick={() => window.print()}>Print Confirmation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
