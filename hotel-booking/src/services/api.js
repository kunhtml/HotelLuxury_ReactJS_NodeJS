import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
});

// Authentication services
export const authService = {
  // Register a new user
  register: async (firstName, lastName, email, phone, password) => {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      phone,
      password,
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Create admin account (for demo)
  createAdmin: async () => {
    const response = await api.post("/auth/create-admin");
    return response.data;
  },
};

// Room services
export const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get("/rooms");
    return response.data;
  },

  // Get room by ID
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Create a new room (admin only)
  createRoom: async (roomData) => {
    const response = await api.post("/rooms", roomData);
    return response.data;
  },

  // Update a room (admin only)
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Delete a room (admin only)
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  // Check room availability
  checkAvailability: async (roomId, checkIn, checkOut) => {
    const response = await api.post("/rooms/check-availability", {
      roomId,
      checkIn,
      checkOut,
    });
    return response.data;
  },

  // Seed sample data (for demo)
  seedData: async () => {
    const response = await api.post("/rooms/seed-data");
    return response.data;
  },
};

// Booking services
export const bookingService = {
  // Get all bookings (admin only)
  getAllBookings: async () => {
    const response = await api.get("/bookings/all");
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Delete a booking (admin only)
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Seed sample bookings (for demo)
  seedData: async () => {
    const response = await api.post("/bookings/seed-data");
    return response.data;
  },
};

// Review services
export const reviewService = {
  // Get all reviews (admin only)
  getAllReviews: async () => {
    const response = await api.get("/reviews/all");
    return response.data;
  },

  // Get reviews by room ID
  getReviewsByRoomId: async (roomId) => {
    const response = await api.get(`/reviews/room/${roomId}`);
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await api.get("/reviews/user");
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // Update review status (admin only)
  updateReviewStatus: async (id, status) => {
    const response = await api.patch(`/reviews/${id}/status`, { status });
    return response.data;
  },

  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Seed sample reviews (for demo)
  seedData: async () => {
    const response = await api.post("/reviews/seed-data");
    return response.data;
  },
};

export default api;
