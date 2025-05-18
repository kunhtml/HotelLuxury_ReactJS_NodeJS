import { createContext, useContext, useState, useEffect } from 'react';
import { rooms as initialRooms } from '../data/rooms';

// Tạo context cho dữ liệu
const DataContext = createContext();

// Hook để sử dụng DataContext
export const useData = () => {
  return useContext(DataContext);
};

// Provider component
export const DataProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mặc định
  useEffect(() => {
    // Khởi tạo phòng
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      setRooms(initialRooms);
      localStorage.setItem('rooms', JSON.stringify(initialRooms));
    }

    // Khởi tạo đặt phòng
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings([]);
      localStorage.setItem('bookings', JSON.stringify([]));
    }

    // Khởi tạo đánh giá
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews([]);
      localStorage.setItem('reviews', JSON.stringify([]));
    }

    setLoading(false);
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
      localStorage.setItem('bookings', JSON.stringify(bookings));
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }, [rooms, bookings, reviews, loading]);

  // Các hàm quản lý phòng
  const addRoom = (room) => {
    const newRoom = {
      ...room,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setRooms([...rooms, newRoom]);
    return newRoom;
  };

  const updateRoom = (id, updatedRoom) => {
    const updatedRooms = rooms.map(room => 
      room.id === id ? { ...room, ...updatedRoom } : room
    );
    setRooms(updatedRooms);
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const getRoomById = (id) => {
    return rooms.find(room => room.id === parseInt(id));
  };

  // Các hàm quản lý đặt phòng
  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const updateBooking = (id, updatedBooking) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, ...updatedBooking } : booking
    );
    setBookings(updatedBookings);
  };

  const deleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const getBookingsByUserId = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  // Các hàm quản lý đánh giá
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending' // Mặc định là pending để admin phê duyệt
    };
    setReviews([...reviews, newReview]);
    return newReview;
  };

  const updateReview = (id, updatedReview) => {
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, ...updatedReview } : review
    );
    setReviews(updatedReviews);
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const getReviewsByRoomId = (roomId) => {
    return reviews.filter(review => review.roomId === parseInt(roomId) && review.status === 'approved');
  };

  const getAverageRatingByRoomId = (roomId) => {
    const roomReviews = reviews.filter(review => review.roomId === parseInt(roomId) && review.status === 'approved');
    if (roomReviews.length === 0) return 0;
    
    const totalRating = roomReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / roomReviews.length;
  };

  // Hàm tạo dữ liệu mẫu
  const seedDatabaseData = () => {
    return new Promise((resolve) => {
      // Tạo đặt phòng mẫu
      const sampleBookings = [
        {
          id: 1,
          userId: 'admin-user',
          roomId: 1,
          roomName: 'Deluxe Room',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          checkIn: '2023-06-15',
          checkOut: '2023-06-20',
          guests: 2,
          nights: 5,
          roomPrice: 150,
          totalPrice: 750,
          status: 'completed',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          userId: 'admin-user',
          roomId: 2,
          roomName: 'Family Suite',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '987-654-3210',
          checkIn: '2023-07-10',
          checkOut: '2023-07-15',
          guests: 3,
          nights: 5,
          roomPrice: 250,
          totalPrice: 1250,
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          userId: 'admin-user',
          roomId: 3,
          roomName: 'Executive Suite',
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'robert@example.com',
          phone: '555-123-4567',
          checkIn: '2023-05-20',
          checkOut: '2023-05-25',
          guests: 2,
          nights: 5,
          roomPrice: 350,
          totalPrice: 1750,
          status: 'cancelled',
          createdAt: new Date().toISOString()
        }
      ];

      // Tạo đánh giá mẫu
      const sampleReviews = [
        {
          id: 1,
          roomId: 1,
          userId: 'admin-user',
          userName: 'Admin User',
          userEmail: 'admin@example.com',
          rating: 5,
          comment: 'Phòng rất tuyệt vời, sạch sẽ và thoải mái. Nhân viên rất thân thiện và hữu ích.',
          createdAt: new Date().toISOString(),
          status: 'approved'
        },
        {
          id: 2,
          roomId: 2,
          userId: 'guest-user',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          rating: 4,
          comment: 'Phòng rộng rãi và thoải mái cho gia đình. Tuy nhiên, Wi-Fi hơi chậm.',
          createdAt: new Date().toISOString(),
          status: 'approved'
        },
        {
          id: 3,
          roomId: 3,
          userId: 'guest-user',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          rating: 5,
          comment: 'Phòng sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng và hiệu quả.',
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      ];

      // Cập nhật state và localStorage
      setBookings(sampleBookings);
      setReviews(sampleReviews);
      localStorage.setItem('bookings', JSON.stringify(sampleBookings));
      localStorage.setItem('reviews', JSON.stringify(sampleReviews));

      resolve({ success: true, message: 'Đã tạo dữ liệu mẫu thành công!' });
    });
  };

  // Hàm cập nhật userId trong dữ liệu mẫu
  const updateSampleDataWithAdminId = (adminId) => {
    return new Promise((resolve) => {
      // Cập nhật userId trong bookings
      const updatedBookings = bookings.map(booking => 
        booking.userId === 'admin-user' ? { ...booking, userId: adminId } : booking
      );
      
      // Cập nhật userId trong reviews
      const updatedReviews = reviews.map(review => 
        review.userId === 'admin-user' ? { ...review, userId: adminId } : review
      );
      
      // Cập nhật state và localStorage
      setBookings(updatedBookings);
      setReviews(updatedReviews);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
      
      resolve({ success: true, message: 'Đã cập nhật dữ liệu mẫu với ID admin!' });
    });
  };

  const value = {
    rooms,
    bookings,
    reviews,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoomById,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsByUserId,
    addReview,
    updateReview,
    deleteReview,
    getReviewsByRoomId,
    getAverageRatingByRoomId,
    seedDatabaseData,
    updateSampleDataWithAdminId
  };

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
};

export default DataContext;
