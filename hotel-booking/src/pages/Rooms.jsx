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
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Our Rooms</h1>
        <p>Choose from our selection of luxurious rooms and suites</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="capacity">Minimum Capacity:</label>
          <select
            id="capacity"
            name="capacity"
            value={filters.capacity}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3">3 People</option>
            <option value="4">4 People</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="price">Maximum Price:</label>
          <select
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
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
            No rooms match your criteria. Please adjust your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
