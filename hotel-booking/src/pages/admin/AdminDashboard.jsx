import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import {
  FaHotel,
  FaCalendarAlt,
  FaComments,
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import AdminOverview from "./AdminOverview";
import AdminRooms from "./AdminRooms";
import AdminBookings from "./AdminBookings";
import AdminReviews from "./AdminReviews";
import AdminUsers from "./AdminUsers";
import RoomForm from "./RoomForm";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/rooms")) {
      setActiveTab("rooms");
    } else if (path.includes("/admin/bookings")) {
      setActiveTab("bookings");
    } else if (path.includes("/admin/reviews")) {
      setActiveTab("reviews");
    } else if (path.includes("/admin/users")) {
      setActiveTab("users");
    } else {
      setActiveTab("overview");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Bảng Điều Khiển</h2>
          <div className="admin-user-info">
            <div className="admin-user-name">
              {currentUser?.name || "Admin"}
            </div>
            <div className="admin-user-role">Quản Trị Viên</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            <FaChartLine /> Tổng Quan
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "rooms" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/rooms")}
          >
            <FaHotel /> Phòng
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/bookings")}
          >
            <FaCalendarAlt /> Đặt Phòng
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "reviews" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/reviews")}
          >
            <FaComments /> Đánh Giá
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/users")}
          >
            <FaUsers /> Người Dùng
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Đăng Xuất
          </button>
        </div>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/rooms" element={<AdminRooms />} />
          <Route path="/rooms/add" element={<RoomForm />} />
          <Route path="/rooms/edit/:id" element={<RoomForm />} />
          <Route path="/bookings" element={<AdminBookings />} />
          <Route path="/reviews" element={<AdminReviews />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="*" element={<AdminOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
