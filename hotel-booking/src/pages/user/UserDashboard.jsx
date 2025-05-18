import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import UserProfile from "./UserProfile";
import UserBookings from "./UserBookings";
import UserTransactions from "./UserTransactions";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
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
    <div className="user-dashboard">
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <h2>Tài Khoản Của Tôi</h2>
          <div className="dashboard-user-info">
            <div className="dashboard-user-name">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className="dashboard-user-email">{currentUser?.email}</div>
          </div>
        </div>
        <nav className="dashboard-nav">
          <button
            className={`dashboard-nav-item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Chỉnh Sửa Hồ Sơ
          </button>
          <button
            className={`dashboard-nav-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <FaCalendarAlt /> Phòng Đã Đặt
          </button>
          <button
            className={`dashboard-nav-item ${
              activeTab === "transactions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <FaMoneyBillWave /> Danh Sách Giao Dịch
          </button>
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="dashboard-logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Đăng Xuất
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "bookings" && <UserBookings />}
        {activeTab === "transactions" && <UserTransactions />}
      </div>
    </div>
  );
};

export default UserDashboard;
