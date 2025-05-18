import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaUserEdit,
  FaUserCog,
} from "react-icons/fa";
import { format } from "date-fns";
import { authService } from "../../services/api";
import "./AdminDashboard.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Giả sử authService có phương thức getAllUsers
        const usersData = await authService.getAllUsers();

        // Format dates
        const formattedUsers = usersData.map((user) => ({
          ...user,
          formattedCreatedAt: format(new Date(user.created_at), "dd/MM/yyyy"),
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu người dùng");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Lọc người dùng dựa trên filter và searchTerm
    let result = [...users];

    // Áp dụng filter
    if (filter !== "all") {
      result = result.filter((user) => user.role === filter);
    }

    // Áp dụng tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(term) ||
          user.lastName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(result);
  }, [users, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openRoleModal = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setNewRole("");
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      // Giả sử authService có phương thức updateUserRole
      await authService.updateUserRole(selectedUser.id, newRole);

      // Update local state
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, role: newRole };
        }
        return user;
      });

      setUsers(updatedUsers);
      closeRoleModal();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật vai trò");
      console.error("Error updating user role:", err);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản Trị Viên";
      case "user":
        return "Người Dùng";
      default:
        return role;
    }
  };

  if (loading && !users.length) {
    return <div className="loading">Đang tải dữ liệu người dùng...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Quản Lý Người Dùng</h1>
      </div>

      <div className="user-filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Tất Cả Người Dùng</option>
            <option value="admin">Quản Trị Viên</option>
            <option value="user">Người Dùng</option>
          </select>
        </div>

        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-data">Không tìm thấy người dùng nào</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Số Đặt Phòng</th>
                <th>Ngày Tham Gia</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>{user.bookings_count}</td>
                  <td>{user.formattedCreatedAt}</td>
                  <td className="action-buttons">
                    <button className="view-button">
                      <FaEye /> Xem
                    </button>

                    {user.role === "user" && (
                      <>
                        <button className="edit-button">
                          <FaUserEdit /> Sửa
                        </button>
                        <button
                          className="role-button"
                          onClick={() => openRoleModal(user, "admin")}
                        >
                          <FaUserCog /> Thăng Cấp
                        </button>
                      </>
                    )}

                    {user.role === "admin" && user.id !== 1 && (
                      <button
                        className="role-button"
                        onClick={() => openRoleModal(user, "user")}
                      >
                        <FaUserCog /> Hạ Cấp
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal xác nhận thay đổi vai trò */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác Nhận Thay Đổi Vai Trò</h2>
            <div className="modal-container">
              <p>
                Bạn có chắc chắn muốn thay đổi vai trò của người dùng{" "}
                <strong>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </strong>{" "}
                thành <strong>{getRoleLabel(newRole)}</strong>?
              </p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeRoleModal}>
                Hủy
              </button>
              <button className="confirm-button" onClick={confirmRoleChange}>
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
