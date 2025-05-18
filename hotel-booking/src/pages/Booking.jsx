import { useState } from 'react';
import { rooms } from '../data/rooms';
import BookingForm from '../components/BookingForm';
import './Booking.css';

const Booking = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book Your Stay</h1>
        <p>Select a room and fill out the booking form</p>
      </div>

      {!selectedRoom ? (
        <div className="room-selection">
          <h2>Select a Room</h2>
          <div className="room-options">
            {rooms.map(room => (
              <div 
                key={room.id} 
                className="room-option"
                onClick={() => handleRoomSelect(room)}
              >
                <img src={room.images[0]} alt={room.name} />
                <div className="room-option-info">
                  <h3>{room.name}</h3>
                  <p className="room-price">${room.price} <span>per night</span></p>
                  <p className="room-capacity">Capacity: {room.capacity} people</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="booking-form-section">
          <div className="selected-room-info">
            <img src={selectedRoom.images[0]} alt={selectedRoom.name} />
            <div className="room-details">
              <h3>{selectedRoom.name}</h3>
              <p className="room-price">${selectedRoom.price} <span>per night</span></p>
              <p className="room-description">{selectedRoom.description}</p>
              <button 
                className="change-room-btn"
                onClick={() => setSelectedRoom(null)}
              >
                Change Room
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
