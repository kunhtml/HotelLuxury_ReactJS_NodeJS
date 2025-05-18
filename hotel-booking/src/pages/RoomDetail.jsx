import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { roomService } from "../services/api";
import BookingForm from "../components/BookingForm";
import ReviewsList from "../components/reviews/ReviewsList";
import ReviewForm from "../components/reviews/ReviewForm";
import { useAuth } from "../contexts/AuthContext";
import "./RoomDetail.css";

const RoomDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(parseInt(id));
        setRoom(roomData);
      } catch (err) {
        setError(err.message || "Error loading room details");
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return <div className="loading">Đang tải thông tin phòng...</div>;
  }

  if (error || !room) {
    return (
      <div className="room-not-found">
        <h2>Không Tìm Thấy Phòng</h2>
        <p>{error || "Phòng bạn đang tìm kiếm không tồn tại."}</p>
        <Link to="/rooms" className="back-btn">
          Quay Lại Danh Sách Phòng
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
            ${room.price} <span>mỗi đêm</span>
          </p>
        </div>

        <div className="room-image-container">
          <img src={room.images[0]} alt={room.name} />
        </div>

        <div className="room-info-container">
          <div className="room-description">
            <h2>Mô Tả</h2>
            <p>{room.description}</p>
          </div>

          <div className="room-details">
            <h2>Chi Tiết</h2>
            <ul>
              <li>
                <span className="detail-label">Sức Chứa:</span>
                <span className="detail-value">{room.capacity} người</span>
              </li>
              <li>
                <span className="detail-label">Kích Thước:</span>
                <span className="detail-value">{room.size} m²</span>
              </li>
            </ul>
          </div>

          <div className="room-amenities">
            <h2>Tiện Nghi</h2>
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
