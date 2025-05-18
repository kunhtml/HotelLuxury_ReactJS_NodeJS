import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.images[0]} alt={room.name} />
      </div>
      <div className="room-info">
        <h3>{room.name}</h3>
        <p className="room-price">${room.price} <span>per night</span></p>
        <p className="room-description">{room.description}</p>
        <div className="room-details">
          <span>Capacity: {room.capacity} people</span>
          <span>Size: {room.size} m²</span>
        </div>
        <Link to={`/rooms/${room.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
