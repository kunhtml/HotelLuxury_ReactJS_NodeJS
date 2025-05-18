import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { roomService, bookingService, reviewService } from "../services/api";
import "./AdminSetup.css";

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [seedResult, setSeedResult] = useState(null);
  const navigate = useNavigate();
  const { createAdminAccount } = useAuth();

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const response = await createAdminAccount();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      // Tạo dữ liệu mẫu cho phòng
      const roomsResponse = await roomService.seedData();

      // Tạo dữ liệu mẫu cho đặt phòng
      const bookingsResponse = await bookingService.seedData();

      // Tạo dữ liệu mẫu cho đánh giá
      const reviewsResponse = await reviewService.seedData();

      setSeedResult({
        success: true,
        message: "Dữ liệu mẫu đã được tạo thành công!",
      });
    } catch (error) {
      setSeedResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h1>Thiết lập tài khoản Admin</h1>
        <p className="setup-description">
          Trang này cho phép bạn tạo một tài khoản admin demo cho ứng dụng Hotel
          Booking. Tài khoản này sẽ có quyền truy cập vào tất cả các tính năng
          quản trị.
        </p>

        <div className="admin-credentials">
          <div className="credential-item">
            <span className="credential-label">Email:</span>
            <span className="credential-value">admin@example.com</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">Mật khẩu:</span>
            <span className="credential-value">admin123</span>
          </div>
        </div>

        <div className="warning-box">
          <p>
            <strong>Lưu ý quan trọng:</strong>
          </p>
          <p>Chỉ sử dụng trang này trong môi trường phát triển hoặc demo.</p>
          <p>
            Đây không phải là cách an toàn để tạo tài khoản admin trong môi
            trường sản xuất.
          </p>
        </div>

        {result && (
          <div className={`result-box ${result.success ? "success" : "error"}`}>
            {result.success ? (
              <>
                <h3>Tài khoản admin đã được tạo thành công!</h3>
                <p>Bạn có thể đăng nhập bằng thông tin đăng nhập ở trên.</p>
              </>
            ) : (
              <>
                <h3>Không thể tạo tài khoản admin</h3>
                <p>{result.error}</p>
                <p>
                  Lỗi này có thể xảy ra nếu tài khoản đã tồn tại hoặc có vấn đề
                  với kết nối đến cơ sở dữ liệu.
                </p>
              </>
            )}
          </div>
        )}

        {seedResult && (
          <div
            className={`result-box ${seedResult.success ? "success" : "error"}`}
          >
            {seedResult.success ? (
              <>
                <h3>Dữ liệu mẫu đã được tạo thành công!</h3>
                <p>
                  Các phòng, đặt phòng và đánh giá mẫu đã được thêm vào cơ sở dữ
                  liệu.
                </p>
              </>
            ) : (
              <>
                <h3>Không thể tạo dữ liệu mẫu</h3>
                <p>{seedResult.error}</p>
                <p>
                  Lỗi này có thể xảy ra nếu có vấn đề với kết nối đến cơ sở dữ
                  liệu hoặc dữ liệu đã tồn tại.
                </p>
              </>
            )}
          </div>
        )}

        <div className="setup-actions">
          <button
            className="create-admin-btn"
            onClick={handleCreateAdmin}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo tài khoản Admin"}
          </button>

          <button
            className="seed-data-btn"
            onClick={handleSeedData}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo dữ liệu mẫu"}
          </button>

          <button className="back-btn" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
