import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { roomService } from "../../services/api";
import "./AdminDashboard.css";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomsData = await roomService.getAllRooms();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu phòng");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // Lọc phòng dựa trên filter và searchTerm
    let result = [...rooms];

    // Áp dụng filter
    if (filter === "available") {
      result = result.filter((room) => !room.is_occupied);
    } else if (filter === "occupied") {
      result = result.filter((room) => room.is_occupied);
    }

    // Áp dụng tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(term) ||
          room.description.toLowerCase().includes(term)
      );
    }

    setFilteredRooms(result);
  }, [rooms, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      await roomService.deleteRoom(roomToDelete.id);
      setRooms(rooms.filter((room) => room.id !== roomToDelete.id));
      setShowDeleteModal(false);
      setRoomToDelete(null);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi xóa phòng");
      console.error("Error deleting room:", err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu phòng...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-rooms">
      <div className="admin-header">
        <h1>Quản Lý Phòng</h1>
        <Link to="/admin/rooms/add" className="add-button">
          Thêm Phòng Mới
        </Link>
      </div>

      <div className="room-filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Tất Cả Phòng</option>
            <option value="available">Còn Trống</option>
            <option value="occupied">Đã Đặt</option>
          </select>
        </div>

        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="rooms-table-container">
        {filteredRooms.length === 0 ? (
          <div className="no-data">Không tìm thấy phòng nào</div>
        ) : (
          <table className="rooms-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Phòng</th>
                <th>Giá</th>
                <th>Sức Chứa</th>
                <th>Kích Thước</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>${parseFloat(room.price).toLocaleString()}</td>
                  <td>{room.capacity} người</td>
                  <td>{room.size} m²</td>
                  <td>
                    <span
                      className={`status-badge ${
                        room.is_occupied ? "occupied" : "available"
                      }`}
                    >
                      {room.is_occupied ? "Đã Đặt" : "Còn Trống"}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link
                      to={`/admin/rooms/edit/${room.id}`}
                      className="edit-button"
                    >
                      <FaEdit /> Sửa
                    </Link>
                    <Link
                      to={`/admin/rooms/view/${room.id}`}
                      className="view-button"
                    >
                      <FaEye /> Xem
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(room)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác Nhận Xóa</h2>
            <div className="modal-container">
              <p>
                Bạn có chắc chắn muốn xóa phòng{" "}
                <strong>"{roomToDelete?.name}"</strong>?
              </p>
              <p>Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelDelete}>
                Hủy
              </button>
              <button className="delete-button" onClick={confirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
