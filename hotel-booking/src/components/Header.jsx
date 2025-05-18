import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { currentUser, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Khách Sạn Luxury</Link>
      </div>
      <nav className="nav">
        <ul>
          {!currentUser || !isAdmin() ? (
            <>
              <li>
                <Link to="/">Trang Chủ</Link>
              </li>
              <li>
                <Link to="/rooms">Phòng</Link>
              </li>
              <li>
                <Link to="/booking">Đặt Phòng</Link>
              </li>
            </>
          ) : null}

          {currentUser ? (
            <>
              <li className="dropdown">
                <button className="dropdown-toggle">
                  <FaUser /> {currentUser.displayName || "Tài Khoản"}
                </button>
                <div className="dropdown-menu">
                  {!isAdmin() && <Link to="/dashboard">Đặt Phòng Của Tôi</Link>}
                  {isAdmin() && (
                    <Link to="/admin">
                      <FaUserShield /> Quản Trị Viên
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="sign-out-btn">
                    <FaSignOutAlt /> Đăng Xuất
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="auth-link">
                  Đăng Nhập
                </Link>
              </li>
              <li>
                <Link to="/signup" className="auth-link signup">
                  Đăng Ký
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
