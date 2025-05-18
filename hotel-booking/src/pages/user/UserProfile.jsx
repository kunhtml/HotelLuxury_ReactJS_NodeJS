import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from 'react-icons/fa';
import './UserDashboard.css';

const UserProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate form
    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      setLoading(false);
      return;
    }

    try {
      // Call API to update profile
      // This is a placeholder - you'll need to implement updateUserProfile in AuthContext
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || null
      });

      setMessage({ type: 'success', text: 'Hồ sơ đã được cập nhật thành công' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ' 
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>Chỉnh Sửa Hồ Sơ</h1>
        <p>Cập nhật thông tin cá nhân của bạn</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Thông Tin Cá Nhân</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                <FaUser className="form-icon" /> Tên
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">
                <FaUser className="form-icon" /> Họ
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="form-icon" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <small>Email không thể thay đổi</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone className="form-icon" /> Số Điện Thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Thay Đổi Mật Khẩu</h2>
          <p>Để trống nếu bạn không muốn thay đổi mật khẩu</p>
          
          <div className="form-group">
            <label htmlFor="currentPassword">
              <FaLock className="form-icon" /> Mật Khẩu Hiện Tại
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">
              <FaLock className="form-icon" /> Mật Khẩu Mới
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock className="form-icon" /> Xác Nhận Mật Khẩu
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={passwordVisible}
                onChange={togglePasswordVisibility}
              />
              Hiển thị mật khẩu
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Đang Lưu...' : <><FaSave /> Lưu Thay Đổi</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
