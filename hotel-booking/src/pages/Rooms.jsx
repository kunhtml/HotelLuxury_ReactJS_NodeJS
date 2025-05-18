import { useState, useEffect } from "react";
import { roomService } from "../services/api";
import RoomCard from "../components/RoomCard";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    capacity: "",
    price: "",
  });

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await roomService.getAllRooms();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (err) {
        setError(err.message || "Error loading rooms");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });

    // Apply filters
    let result = [...rooms];

    // Filter by capacity
    if (name === "capacity" && value) {
      result = result.filter((room) => room.capacity >= parseInt(value));
    }

    // Filter by price
    if (name === "price" && value) {
      const maxPrice = parseInt(value);
      result = result.filter((room) => room.price <= maxPrice);
    }

    // Apply both filters if both are set
    if (name === "capacity" && filters.price) {
      result = result.filter((room) => room.price <= parseInt(filters.price));
    } else if (name === "price" && filters.capacity) {
      result = result.filter(
        (room) => room.capacity >= parseInt(filters.capacity)
      );
    }

    setFilteredRooms(result);
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách phòng...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Danh Sách Phòng</h1>
        <p>Lựa chọn từ bộ sưu tập phòng và suite sang trọng của chúng tôi</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="capacity">Sức Chứa Tối Thiểu:</label>
          <select
            id="capacity"
            name="capacity"
            value={filters.capacity}
            onChange={handleFilterChange}
          >
            <option value="">Tất Cả</option>
            <option value="1">1 Người</option>
            <option value="2">2 Người</option>
            <option value="3">3 Người</option>
            <option value="4">4 Người</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="price">Giá Tối Đa:</label>
          <select
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
          >
            <option value="">Tất Cả</option>
            <option value="100">$100</option>
            <option value="200">$200</option>
            <option value="300">$300</option>
            <option value="400">$400</option>
            <option value="500">$500</option>
          </select>
        </div>
      </div>

      <div className="rooms-container">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <p className="no-rooms">
            Không tìm thấy phòng phù hợp với tiêu chí. Vui lòng điều chỉnh bộ
            lọc.
          </p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
