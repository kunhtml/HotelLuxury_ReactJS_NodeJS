import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSearch, FaFilter, FaFileDownload } from 'react-icons/fa';
import { bookingService } from '../../services/api';
import './UserDashboard.css';

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // In a real app, you would have a separate API for transactions
        // Here we're using bookings as a placeholder
        const bookingsData = await bookingService.getUserBookings();
        
        // Convert bookings to transactions format
        const transactionsData = bookingsData.map(booking => ({
          id: booking.id,
          date: new Date(booking.created_at || booking.createdAt),
          amount: parseFloat(booking.total_price || booking.totalPrice),
          description: `Đặt phòng ${booking.room_name || booking.roomName}`,
          status: booking.status === 'cancelled' ? 'refunded' : 
                 booking.status === 'completed' ? 'completed' : 'pending',
          paymentMethod: 'Credit Card', // Placeholder
          reference: `BOOK-${booking.id}`
        }));
        
        // Format dates for display
        const formattedTransactions = transactionsData.map(transaction => ({
          ...transaction,
          formattedDate: format(transaction.date, 'dd/MM/yyyy HH:mm')
        }));
        
        setTransactions(formattedTransactions);
        setFilteredTransactions(formattedTransactions);
      } catch (error) {
        setError('Lỗi khi tải dữ liệu giao dịch: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on filter, searchTerm, and dateRange
    let result = [...transactions];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(transaction => transaction.status === filter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(term) || 
        transaction.reference.toLowerCase().includes(term)
      );
    }
    
    // Apply date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter(transaction => transaction.date >= fromDate);
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(transaction => transaction.date <= toDate);
    }
    
    setFilteredTransactions(result);
  }, [transactions, filter, searchTerm, dateRange]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn Thành';
      case 'pending': return 'Đang Xử Lý';
      case 'refunded': return 'Đã Hoàn Tiền';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  };

  const downloadTransactions = () => {
    // In a real app, this would generate a CSV or PDF file
    alert('Tính năng tải xuống sẽ được triển khai trong phiên bản tiếp theo.');
  };

  if (loading && !transactions.length) {
    return <div className="loading">Đang tải dữ liệu giao dịch...</div>;
  }

  return (
    <div className="user-transactions">
      <div className="transactions-header">
        <h1>Danh Sách Giao Dịch</h1>
        <p>Xem lịch sử giao dịch của bạn</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="transactions-filters">
        <div className="filter-row">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              className="filter-select"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">Tất Cả Giao Dịch</option>
              <option value="completed">Hoàn Thành</option>
              <option value="pending">Đang Xử Lý</option>
              <option value="refunded">Đã Hoàn Tiền</option>
            </select>
          </div>
          
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm giao dịch..." 
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <button className="download-button" onClick={downloadTransactions}>
            <FaFileDownload /> Tải Xuống
          </button>
        </div>
        
        <div className="filter-row date-filters">
          <div className="date-group">
            <label>Từ ngày:</label>
            <input 
              type="date" 
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>
          
          <div className="date-group">
            <label>Đến ngày:</label>
            <input 
              type="date" 
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>
        </div>
      </div>

      <div className="transactions-table-container">
        {filteredTransactions.length === 0 ? (
          <div className="no-data">Không tìm thấy giao dịch nào</div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Mã Giao Dịch</th>
                <th>Ngày</th>
                <th>Mô Tả</th>
                <th>Số Tiền</th>
                <th>Phương Thức</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.reference}</td>
                  <td>{transaction.formattedDate}</td>
                  <td>{transaction.description}</td>
                  <td className="amount">${transaction.amount.toLocaleString()}</td>
                  <td>{transaction.paymentMethod}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;
