import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaHotel, FaCalendarAlt, FaComments, FaUsers } from 'react-icons/fa';
import { roomService, bookingService, reviewService } from '../../services/api';
import './AdminDashboard.css';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu phòng
        const rooms = await roomService.getAllRooms();
        
        // Lấy dữ liệu đặt phòng
        const bookings = await bookingService.getAllBookings();
        
        // Lấy dữ liệu đánh giá
        const reviews = await reviewService.getAllReviews();
        
        // Tính toán số phòng đang được đặt
        const today = new Date();
        const occupiedRooms = bookings.filter(booking => 
          new Date(booking.check_in) <= today && 
          new Date(booking.check_out) >= today &&
          booking.status === 'confirmed'
        ).length;
        
        // Tính toán doanh thu
        const totalRevenue = bookings
          .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
          .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);
        
        // Tính toán doanh thu tuần này
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyRevenue = bookings
          .filter(booking => 
            new Date(booking.created_at) >= oneWeekAgo && 
            (booking.status === 'confirmed' || booking.status === 'completed')
          )
          .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);
        
        // Tính toán doanh thu tháng này
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const monthlyRevenue = bookings
          .filter(booking => 
            new Date(booking.created_at) >= oneMonthAgo && 
            (booking.status === 'confirmed' || booking.status === 'completed')
          )
          .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);
        
        // Tính toán đánh giá trung bình
        const approvedReviews = reviews.filter(review => review.status === 'approved');
        const averageRating = approvedReviews.length > 0 
          ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length 
          : 0;
        
        // Cập nhật state
        setStats({
          totalRooms: rooms.length,
          occupiedRooms,
          availableRooms: rooms.length - occupiedRooms,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
          totalRevenue,
          weeklyRevenue,
          monthlyRevenue,
          averageRating,
          totalReviews: approvedReviews.length
        });
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-overview">
      <h1>Tổng Quan Bảng Điều Khiển</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Trạng Thái Phòng</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Tổng Số Phòng</span>
              <span className="stat-value">{stats.totalRooms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã Đặt</span>
              <span className="stat-value">{stats.occupiedRooms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Còn Trống</span>
              <span className="stat-value">{stats.availableRooms}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Đặt Phòng</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Tổng Đặt Phòng</span>
              <span className="stat-value">{stats.totalBookings}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang Chờ Xử Lý</span>
              <span className="stat-value">{stats.pendingBookings}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tỷ Lệ Lấp Đầy</span>
              <span className="stat-value">
                {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Doanh Thu</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Tổng Doanh Thu</span>
              <span className="stat-value">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Doanh Thu Tuần Này</span>
              <span className="stat-value">${stats.weeklyRevenue.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Doanh Thu Tháng Này</span>
              <span className="stat-value">${stats.monthlyRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Đánh Giá</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Đánh Giá Trung Bình</span>
              <span className="stat-value">{stats.averageRating.toFixed(1)}/5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng Đánh Giá</span>
              <span className="stat-value">{stats.totalReviews}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Thao Tác Nhanh</h2>
        <div className="action-buttons">
          <Link to="/admin/rooms/add" className="action-button">
            Thêm Phòng Mới
          </Link>
          <Link to="/admin/bookings" className="action-button">
            Quản Lý Đặt Phòng
          </Link>
          <Link to="/admin/reviews" className="action-button">
            Kiểm Duyệt Đánh Giá
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
