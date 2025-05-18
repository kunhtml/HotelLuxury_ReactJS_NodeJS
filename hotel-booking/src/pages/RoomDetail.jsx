import { useParams, Link } from "react-router-dom";
import { rooms } from "../data/rooms";
import BookingForm from "../components/BookingForm";
import ReviewsList from "../components/reviews/ReviewsList";
import ReviewForm from "../components/reviews/ReviewForm";
import { useAuth } from "../contexts/AuthContext";
import "./RoomDetail.css";

const RoomDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const room = rooms.find((room) => room.id === parseInt(id));

  if (!room) {
    return (
      <div className="room-not-found">
        <h2>Room Not Found</h2>
        <p>The room you're looking for doesn't exist.</p>
        <Link to="/rooms" className="back-btn">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        <div className="room-detail-header">
          <h1>{room.name}</h1>
          <p className="room-price">
            ${room.price} <span>per night</span>
          </p>
        </div>

        <div className="room-image-container">
          <img src={room.images[0]} alt={room.name} />
        </div>

        <div className="room-info-container">
          <div className="room-description">
            <h2>Description</h2>
            <p>{room.description}</p>
          </div>

          <div className="room-details">
            <h2>Details</h2>
            <ul>
              <li>
                <span className="detail-label">Capacity:</span>
                <span className="detail-value">{room.capacity} people</span>
              </li>
              <li>
                <span className="detail-label">Size:</span>
                <span className="detail-value">{room.size} m²</span>
              </li>
            </ul>
          </div>

          <div className="room-amenities">
            <h2>Amenities</h2>
            <ul>
              {room.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <BookingForm
        roomId={room.id}
        roomName={room.name}
        roomPrice={room.price}
      />

      <div className="room-reviews-section">
        <ReviewsList roomId={room.id} />
        <ReviewForm roomId={room.id} />
      </div>
    </div>
  );
};

export default RoomDetail;
