import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaSearch, FaFilter, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { bookingService } from '../../services/api';
import './AdminDashboard.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const bookingsData = await bookingService.getAllBookings();
        
        // Format dates
        const formattedBookings = bookingsData.map(booking => ({
          ...booking,
          formattedCheckIn: format(new Date(booking.check_in), 'dd/MM/yyyy'),
          formattedCheckOut: format(new Date(booking.check_out), 'dd/MM/yyyy'),
          formattedCreatedAt: format(new Date(booking.created_at), 'dd/MM/yyyy HH:mm')
        }));
        
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu đặt phòng');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Lọc đặt phòng dựa trên filter và searchTerm
    let result = [...bookings];
    
    // Áp dụng filter
    if (filter !== 'all') {
      result = result.filter(booking => booking.status === filter);
    }
    
    // Áp dụng tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.room_name?.toLowerCase().includes(term) || 
        booking.user_name?.toLowerCase().includes(term) ||
        booking.user_email?.toLowerCase().includes(term) ||
        booking.first_name?.toLowerCase().includes(term) ||
        booking.last_name?.toLowerCase().includes(term) ||
        booking.email?.toLowerCase().includes(term)
      );
    }
    
    setFilteredBookings(result);
  }, [bookings, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openStatusModal = (booking, status) => {
    setSelectedBooking(booking);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedBooking(null);
    setNewStatus('');
  };

  const confirmStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;
    
    try {
      await bookingService.updateBookingStatus(selectedBooking.id, newStatus);
      
      // Update local state
      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          return { ...booking, status: newStatus };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      closeStatusModal();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      console.error('Error updating booking status:', err);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Đang Chờ';
      case 'confirmed': return 'Đã Xác Nhận';
      case 'cancelled': return 'Đã Hủy';
      case 'completed': return 'Đã Hoàn Thành';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu đặt phòng...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-bookings">
      <div className="admin-header">
        <h1>Quản Lý Đặt Phòng</h1>
      </div>
      
      <div className="booking-filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select 
            className="filter-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Tất Cả Đặt Phòng</option>
            <option value="pending">Đang Chờ</option>
            <option value="confirmed">Đã Xác Nhận</option>
            <option value="completed">Đã Hoàn Thành</option>
            <option value="cancelled">Đã Hủy</option>
          </select>
        </div>
        
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm đặt phòng..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="bookings-table-container">
        {filteredBookings.length === 0 ? (
          <div className="no-data">Không tìm thấy đặt phòng nào</div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phòng</th>
                <th>Khách Hàng</th>
                <th>Ngày Nhận</th>
                <th>Ngày Trả</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.room_name}</td>
                  <td>
                    <div>{booking.first_name} {booking.last_name}</div>
                    <div className="email-cell">{booking.email}</div>
                  </td>
                  <td>{booking.formattedCheckIn}</td>
                  <td>{booking.formattedCheckOut}</td>
                  <td>${parseFloat(booking.total_price).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link to={`/admin/bookings/view/${booking.id}`} className="view-button">
                      <FaEye /> Xem
                    </Link>
                    
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          className="confirm-button"
                          onClick={() => openStatusModal(booking, 'confirmed')}
                        >
                          <FaCheck /> Xác Nhận
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={() => openStatusModal(booking, 'cancelled')}
                        >
                          <FaTimes /> Hủy
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <>
                        <button 
                          className="complete-button"
                          onClick={() => openStatusModal(booking, 'completed')}
                        >
                          <FaCalendarAlt /> Hoàn Thành
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={() => openStatusModal(booking, 'cancelled')}
                        >
                          <FaTimes /> Hủy
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal xác nhận thay đổi trạng thái */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác Nhận Thay Đổi Trạng Thái</h2>
            <p>
              Bạn có chắc chắn muốn thay đổi trạng thái đặt phòng #{selectedBooking?.id} sang{' '}
              <strong>{getStatusLabel(newStatus)}</strong>?
            </p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeStatusModal}>Hủy</button>
              <button className="confirm-button" onClick={confirmStatusChange}>Xác Nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
