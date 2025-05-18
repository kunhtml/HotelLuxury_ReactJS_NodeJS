import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

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
            onClick={() => setActiveTab("overview")}
          >
            <FaChartLine /> Tổng Quan
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "rooms" ? "active" : ""
            }`}
            onClick={() => setActiveTab("rooms")}
          >
            <FaHotel /> Phòng
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <FaCalendarAlt /> Đặt Phòng
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "reviews" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            <FaComments /> Đánh Giá
          </button>
          <button
            className={`admin-nav-item ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
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
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "rooms" && <AdminRooms />}
        {activeTab === "bookings" && <AdminBookings />}
        {activeTab === "reviews" && <AdminReviews />}
        {activeTab === "users" && <AdminUsers />}
      </div>
    </div>
  );
};

export default AdminDashboard;
