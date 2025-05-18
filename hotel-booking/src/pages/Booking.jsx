import { useState, useEffect } from "react";
import { roomService } from "../services/api";
import BookingForm from "../components/BookingForm";
import "./Booking.css";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await roomService.getAllRooms();
        setRooms(roomsData);
      } catch (err) {
        setError(err.message || "Error loading rooms");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-header">
          <h1>Đặt Phòng</h1>
          <p>Chọn phòng và điền vào biểu mẫu đặt phòng</p>
        </div>
        <div className="loading">Đang tải danh sách phòng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="booking-header">
          <h1>Đặt Phòng</h1>
          <p>Chọn phòng và điền vào biểu mẫu đặt phòng</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Đặt Phòng</h1>
        <p>Chọn phòng và điền vào biểu mẫu đặt phòng</p>
      </div>

      {!selectedRoom ? (
        <div className="room-selection">
          <h2>Chọn Phòng</h2>
          <div className="room-options">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="room-option"
                onClick={() => handleRoomSelect(room)}
              >
                <img
                  src={room.image_url || (room.images && room.images[0])}
                  alt={room.name}
                />
                <div className="room-option-info">
                  <h3>{room.name}</h3>
                  <p className="room-price">
                    ${room.price} <span>mỗi đêm</span>
                  </p>
                  <p className="room-capacity">
                    Sức chứa: {room.capacity} người
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="booking-form-section">
          <div className="selected-room-info">
            <img
              src={
                selectedRoom.image_url ||
                (selectedRoom.images && selectedRoom.images[0])
              }
              alt={selectedRoom.name}
            />
            <div className="room-details">
              <h3>{selectedRoom.name}</h3>
              <p className="room-price">
                ${selectedRoom.price} <span>mỗi đêm</span>
              </p>
              <p className="room-description">{selectedRoom.description}</p>
              <button
                className="change-room-btn"
                onClick={() => setSelectedRoom(null)}
              >
                Đổi Phòng
              </button>
            </div>
          </div>

          <BookingForm
            roomId={selectedRoom.id}
            roomName={selectedRoom.name}
            roomPrice={selectedRoom.price}
          />
        </div>
      )}
    </div>
  );
};

export default Booking;
