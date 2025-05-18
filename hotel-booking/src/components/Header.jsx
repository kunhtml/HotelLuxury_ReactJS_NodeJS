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
        <Link to="/">Luxury Hotel</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/rooms">Rooms</Link>
          </li>
          <li>
            <Link to="/booking">Book Now</Link>
          </li>

          {currentUser ? (
            <>
              <li className="dropdown">
                <button className="dropdown-toggle">
                  <FaUser /> {currentUser.displayName || "Account"}
                </button>
                <div className="dropdown-menu">
                  <Link to="/dashboard">My Bookings</Link>
                  {isAdmin() && (
                    <Link to="/admin">
                      <FaUserShield /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="sign-out-btn">
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="auth-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="auth-link signup">
                  Sign Up
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
