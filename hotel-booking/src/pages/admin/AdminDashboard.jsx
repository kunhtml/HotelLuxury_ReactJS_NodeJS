import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHotel, FaCalendarAlt, FaComments, FaChartLine, FaUsers } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine /> Overview
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <FaHotel /> Rooms
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendarAlt /> Bookings
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <FaComments /> Reviews
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'rooms' && <AdminRooms />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
};

const AdminOverview = () => {
  // Mock data for demonstration
  const stats = {
    totalRooms: 25,
    occupiedRooms: 18,
    availableRooms: 7,
    totalBookings: 156,
    pendingBookings: 12,
    totalRevenue: 45250,
    weeklyRevenue: 8750,
    monthlyRevenue: 32500,
    averageRating: 4.7,
    totalReviews: 89
  };

  return (
    <div className="admin-overview">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Room Status</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Total Rooms</span>
              <span className="stat-value">{stats.totalRooms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Occupied</span>
              <span className="stat-value">{stats.occupiedRooms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available</span>
              <span className="stat-value">{stats.availableRooms}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Bookings</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Total Bookings</span>
              <span className="stat-value">{stats.totalBookings}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pendingBookings}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Occupancy Rate</span>
              <span className="stat-value">{Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Revenue</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">${stats.totalRevenue}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Weekly Revenue</span>
              <span className="stat-value">${stats.weeklyRevenue}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Revenue</span>
              <span className="stat-value">${stats.monthlyRevenue}</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <h3>Reviews</h3>
          </div>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value">{stats.averageRating}/5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Reviews</span>
              <span className="stat-value">{stats.totalReviews}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/rooms/add" className="action-button">
            Add New Room
          </Link>
          <Link to="/admin/bookings" className="action-button">
            Manage Bookings
          </Link>
          <Link to="/admin/reviews" className="action-button">
            Moderate Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminRooms = () => {
  // Mock data for demonstration
  const rooms = [
    { id: 1, name: 'Deluxe Room', price: 150, capacity: 2, status: 'available' },
    { id: 2, name: 'Family Suite', price: 250, capacity: 4, status: 'occupied' },
    { id: 3, name: 'Executive Suite', price: 350, capacity: 2, status: 'occupied' },
    { id: 4, name: 'Standard Room', price: 100, capacity: 2, status: 'available' },
    { id: 5, name: 'Presidential Suite', price: 500, capacity: 4, status: 'occupied' }
  ];

  return (
    <div className="admin-rooms">
      <div className="admin-header">
        <h1>Room Management</h1>
        <Link to="/admin/rooms/add" className="add-button">Add New Room</Link>
      </div>
      
      <div className="room-filters">
        <select className="filter-select">
          <option value="all">All Rooms</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search rooms..." 
          className="search-input"
        />
      </div>
      
      <div className="rooms-table-container">
        <table className="rooms-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Name</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.name}</td>
                <td>${room.price}</td>
                <td>{room.capacity} people</td>
                <td>
                  <span className={`status-badge ${room.status}`}>
                    {room.status === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="edit-button">Edit</button>
                  <button className="view-button">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  // Mock data for demonstration
  const bookings = [
    { id: 'B001', roomName: 'Deluxe Room', guestName: 'John Doe', checkIn: '2023-05-10', checkOut: '2023-05-15', status: 'completed' },
    { id: 'B002', roomName: 'Family Suite', guestName: 'Jane Smith', checkIn: '2023-05-15', checkOut: '2023-05-20', status: 'active' },
    { id: 'B003', roomName: 'Executive Suite', guestName: 'Robert Johnson', checkIn: '2023-05-20', checkOut: '2023-05-25', status: 'upcoming' },
    { id: 'B004', roomName: 'Standard Room', guestName: 'Emily Davis', checkIn: '2023-05-12', checkOut: '2023-05-14', status: 'cancelled' },
    { id: 'B005', roomName: 'Presidential Suite', guestName: 'Michael Wilson', checkIn: '2023-05-18', checkOut: '2023-05-22', status: 'upcoming' }
  ];

  return (
    <div className="admin-bookings">
      <h1>Booking Management</h1>
      
      <div className="booking-filters">
        <select className="filter-select">
          <option value="all">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search bookings..." 
          className="search-input"
        />
      </div>
      
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.roomName}</td>
                <td>{booking.guestName}</td>
                <td>{booking.checkIn}</td>
                <td>{booking.checkOut}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="view-button">View</button>
                  {booking.status === 'upcoming' && (
                    <button className="cancel-button">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminReviews = () => {
  // Mock data for demonstration
  const reviews = [
    { id: 1, roomName: 'Deluxe Room', userName: 'John Doe', rating: 5, comment: 'Excellent room and service!', status: 'approved', date: '2023-05-01' },
    { id: 2, roomName: 'Family Suite', userName: 'Jane Smith', rating: 4, comment: 'Great room for families.', status: 'approved', date: '2023-05-05' },
    { id: 3, roomName: 'Executive Suite', userName: 'Robert Johnson', rating: 3, comment: 'Good but could be better.', status: 'pending', date: '2023-05-08' },
    { id: 4, roomName: 'Standard Room', userName: 'Emily Davis', rating: 2, comment: 'Room was smaller than expected.', status: 'pending', date: '2023-05-10' },
    { id: 5, roomName: 'Presidential Suite', userName: 'Michael Wilson', rating: 5, comment: 'Absolutely luxurious!', status: 'approved', date: '2023-05-12' }
  ];

  return (
    <div className="admin-reviews">
      <h1>Review Management</h1>
      
      <div className="review-filters">
        <select className="filter-select">
          <option value="all">All Reviews</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search reviews..." 
          className="search-input"
        />
      </div>
      
      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.roomName}</td>
                <td>{review.userName}</td>
                <td>{review.rating}/5</td>
                <td className="comment-cell">{review.comment}</td>
                <td>{review.date}</td>
                <td>
                  <span className={`status-badge ${review.status}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </td>
                <td className="action-buttons">
                  {review.status === 'pending' && (
                    <>
                      <button className="approve-button">Approve</button>
                      <button className="reject-button">Reject</button>
                    </>
                  )}
                  <button className="view-button">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  // Mock data for demonstration
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', bookings: 3, joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', bookings: 5, joined: '2023-02-20' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', bookings: 0, joined: '2023-01-01' },
    { id: 4, name: 'Robert Johnson', email: 'robert@example.com', role: 'user', bookings: 2, joined: '2023-03-10' },
    { id: 5, name: 'Emily Davis', email: 'emily@example.com', role: 'user', bookings: 1, joined: '2023-04-05' }
  ];

  return (
    <div className="admin-users">
      <h1>User Management</h1>
      
      <div className="user-filters">
        <select className="filter-select">
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="user">Regular Users</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search users..." 
          className="search-input"
        />
      </div>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bookings</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>{user.bookings}</td>
                <td>{user.joined}</td>
                <td className="action-buttons">
                  <button className="view-button">View</button>
                  {user.role !== 'admin' && (
                    <button className="edit-button">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
