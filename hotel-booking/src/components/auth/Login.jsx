import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  // Check if there's a message or redirect in the location state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Redirect to the specified page or home
      if (location.state?.redirectTo) {
        navigate(location.state.redirectTo);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      // Redirect to the specified page or home
      if (location.state?.redirectTo) {
        navigate(location.state.redirectTo);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p className="auth-subtitle">
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group form-actions">
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ghi nhớ đăng nhập</label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button
          className="google-auth-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle className="google-icon" />
          <span>Đăng nhập với Google</span>
        </button>

        <p className="auth-redirect">
          Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
