import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { roomService } from "../services/api";
import BookingForm from "../components/BookingForm";
import ReviewsList from "../components/reviews/ReviewsList";
import ReviewForm from "../components/reviews/ReviewForm";
import { useAuth } from "../contexts/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./RoomDetail.css";

const RoomDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  // Reset currentImageIndex when room ID changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(parseInt(id));
        console.log("Room data received:", roomData);

        // Ensure images is an array
        if (roomData && !roomData.images) {
          roomData.images = [];
        }

        // If there's an image_url but no images, add it to images array
        if (roomData && roomData.image_url && roomData.images.length === 0) {
          roomData.images.push(roomData.image_url);
        }

        setRoom(roomData);
        // Reset image index when loading a new room
        setCurrentImageIndex(0);
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
          {room.images && room.images.length > 0 ? (
            <>
              <img
                key={`main-image-${currentImageIndex}`} // Add key to force re-render
                src={room.images[currentImageIndex]}
                alt={`${room.name} - Ảnh ${currentImageIndex + 1}`}
                onClick={() => setShowGallery(true)}
              />

              {room.images.length > 1 && (
                <div className="image-navigation">
                  <button
                    className="nav-button prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? room.images.length - 1 : prev - 1
                      );
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {room.images.length}
                  </div>
                  <button
                    className="nav-button next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === room.images.length - 1 ? 0 : prev + 1
                      );
                    }}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <img
              src={room.image_url || ""}
              alt={room.name}
              onClick={() => setShowGallery(true)}
            />
          )}
        </div>

        {room.images && room.images.length > 1 && (
          <div className="room-thumbnails">
            {room.images.map((image, index) => (
              <div
                key={`thumb-${index}`}
                className={`thumbnail ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => {
                  console.log("Thumbnail clicked, changing to index:", index);
                  setCurrentImageIndex(index);
                }}
              >
                <img src={image} alt={`${room.name} - Ảnh ${index + 1}`} />
              </div>
            ))}
          </div>
        )}

        {showGallery && (
          <div
            className="gallery-overlay"
            onClick={() => setShowGallery(false)}
          >
            <div
              className="gallery-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-gallery"
                onClick={() => setShowGallery(false)}
              >
                ×
              </button>
              <div className="gallery-image-container">
                <img
                  key={`gallery-image-${currentImageIndex}`} // Add key to force re-render
                  src={
                    room.images && room.images.length > 0
                      ? room.images[currentImageIndex]
                      : room.image_url
                  }
                  alt={`${room.name} - Ảnh ${currentImageIndex + 1}`}
                />

                {room.images && room.images.length > 1 && (
                  <>
                    <button
                      className="gallery-nav prev"
                      onClick={() => {
                        const newIndex =
                          currentImageIndex === 0
                            ? room.images.length - 1
                            : currentImageIndex - 1;
                        console.log(
                          "Gallery prev clicked, changing to index:",
                          newIndex
                        );
                        setCurrentImageIndex(newIndex);
                      }}
                    >
                      <FaArrowLeft />
                    </button>

                    <button
                      className="gallery-nav next"
                      onClick={() => {
                        const newIndex =
                          currentImageIndex === room.images.length - 1
                            ? 0
                            : currentImageIndex + 1;
                        console.log(
                          "Gallery next clicked, changing to index:",
                          newIndex
                        );
                        setCurrentImageIndex(newIndex);
                      }}
                    >
                      <FaArrowRight />
                    </button>
                  </>
                )}
              </div>

              {room.images && room.images.length > 1 && (
                <div className="gallery-counter">
                  {currentImageIndex + 1} / {room.images.length}
                </div>
              )}
            </div>
          </div>
        )}

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
