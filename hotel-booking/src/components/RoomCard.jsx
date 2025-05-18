import { Link } from "react-router-dom";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img
          src={room.image_url || (room.images && room.images[0])}
          alt={room.name}
        />
      </div>
      <div className="room-info">
        <h3>{room.name}</h3>
        <p className="room-price">
          ${room.price} <span>mỗi đêm</span>
        </p>
        <p className="room-description">{room.description}</p>
        <div className="room-details">
          <span>Sức chứa: {room.capacity} người</span>
          <span>Kích thước: {room.size} m²</span>
        </div>
        <Link to={`/rooms/${room.id}`} className="view-details-btn">
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
