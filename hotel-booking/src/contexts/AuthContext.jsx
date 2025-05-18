import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Try to get current user from session
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Register a new user
  const signup = async (firstName, lastName, email, phone, password) => {
    try {
      const data = await authService.register(
        firstName,
        lastName,
        email,
        phone,
        password
      );
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // Login with Google (not implemented in backend, would require OAuth)
  const loginWithGoogle = async () => {
    throw new Error("Google login not implemented with MySQL backend");
  };

  // Logout user
  const signOut = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      // This is a placeholder - you'll need to implement updateProfile in authService
      const updatedUser = await authService.updateProfile(userData);
      setCurrentUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Create admin account (for demo)
  const createAdminAccount = async () => {
    try {
      const response = await authService.createAdmin();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    signOut,
    isAdmin,
    updateUserProfile,
    createAdminAccount,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
