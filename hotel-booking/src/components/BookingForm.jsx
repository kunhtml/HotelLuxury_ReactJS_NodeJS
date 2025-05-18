import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import "./BookingForm.css";

const BookingForm = ({ roomId, roomName, roomPrice }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: format(new Date(), "yyyy-MM-dd"),
    checkOut: format(
      new Date(new Date().setDate(new Date().getDate() + 1)),
      "yyyy-MM-dd"
    ),
    guests: 1,
    specialRequests: "",
  });

  // Auto-fill user information when logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prevData) => ({
        ...prevData,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      // Redirect to login if not logged in
      navigate("/login", {
        state: {
          message: "Please log in to book a room",
          redirectTo: `/rooms/${roomId}`,
        },
      });
      return;
    }

    // Calculate the number of nights
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomPrice * nights;

    try {
      // In a real application with API, you would send this data to the server
      // const response = await bookingService.createBooking({
      //   roomId,
      //   checkIn: formData.checkIn,
      //   checkOut: formData.checkOut,
      //   guests: formData.guests,
      //   totalPrice,
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      //   phone: formData.phone,
      //   specialRequests: formData.specialRequests
      // });

      // For now, just navigate to confirmation page with booking details
      navigate("/booking/confirmation", {
        state: {
          booking: {
            ...formData,
            roomId,
            roomName,
            roomPrice,
            nights,
            totalPrice,
          },
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Book Your Stay</h2>
      {roomName && (
        <p className="selected-room">
          Selected Room: {roomName} (${roomPrice}/night)
        </p>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkIn">Check-in Date</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              min={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkOut">Check-out Date</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={format(
                new Date(new Date().setDate(new Date().getDate() + 1)),
                "yyyy-MM-dd"
              )}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="guests">Number of Guests</label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
