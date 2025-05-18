import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import { roomService } from "../../services/api";
import "./AdminDashboard.css";

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    size: "",
    image_url: "",
    amenities: [],
    images: []
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        try {
          setLoading(true);
          const roomData = await roomService.getRoomById(id);
          setFormData({
            name: roomData.name || "",
            description: roomData.description || "",
            price: roomData.price || "",
            capacity: roomData.capacity || "",
            size: roomData.size || "",
            image_url: roomData.image_url || "",
            amenities: roomData.amenities || [],
            images: roomData.images || []
          });
        } catch (err) {
          setError("Lỗi khi tải dữ liệu phòng: " + (err.message || "Đã xảy ra lỗi"));
          console.error("Error fetching room:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchRoom();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "capacity" || name === "size" 
        ? value.replace(/[^0-9.]/g, '') 
        : value
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.price || 
          !formData.capacity || !formData.size || !formData.image_url) {
        throw new Error("Vui lòng điền đầy đủ thông tin phòng");
      }

      // Convert numeric fields
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        size: parseInt(formData.size)
      };

      if (isEditMode) {
        await roomService.updateRoom(id, roomData);
        setSuccess("Cập nhật phòng thành công!");
      } else {
        await roomService.createRoom(roomData);
        setSuccess("Thêm phòng mới thành công!");
        // Reset form after successful creation
        setFormData({
          name: "",
          description: "",
          price: "",
          capacity: "",
          size: "",
          image_url: "",
          amenities: [],
          images: []
        });
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lưu phòng");
      console.error("Error saving room:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/rooms");
  };

  if (loading && isEditMode) {
    return <div className="loading">Đang tải dữ liệu phòng...</div>;
  }

  return (
    <div className="room-form-container">
      <div className="form-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Quay Lại
        </button>
        <h1>{isEditMode ? "Chỉnh Sửa Phòng" : "Thêm Phòng Mới"}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="room-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Thông Tin Cơ Bản</h2>
          
          <div className="form-group">
            <label htmlFor="name">Tên Phòng</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Mô Tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Giá (USD)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Sức Chứa (người)</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="size">Kích Thước (m²)</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="image_url">Ảnh Chính</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Nhập URL ảnh"
              required
            />
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Ảnh chính" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Tiện Nghi</h2>
          
          <div className="add-item-group">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Nhập tiện nghi"
            />
            <button 
              type="button" 
              className="add-button"
              onClick={handleAddAmenity}
            >
              <FaPlus /> Thêm
            </button>
          </div>
          
          <div className="items-list">
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="item-tag">
                {amenity}
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveAmenity(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {formData.amenities.length === 0 && (
              <p className="no-items">Chưa có tiện nghi nào</p>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Ảnh Bổ Sung</h2>
          
          <div className="add-item-group">
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Nhập URL ảnh"
            />
            <button 
              type="button" 
              className="add-button"
              onClick={handleAddImage}
            >
              <FaPlus /> Thêm
            </button>
          </div>
          
          <div className="images-grid">
            {formData.images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image} alt={`Ảnh ${index + 1}`} />
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveImage(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <p className="no-items">Chưa có ảnh bổ sung nào</p>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleBack}>
            Hủy
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Đang Lưu..." : <><FaSave /> {isEditMode ? "Cập Nhật" : "Lưu"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
