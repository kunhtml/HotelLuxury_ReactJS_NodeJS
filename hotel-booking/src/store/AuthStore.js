import { createContext, useContext, useState, useEffect } from 'react';

// Tạo context cho authentication
const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra nếu người dùng đã đăng nhập (từ localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Tìm người dùng với email và password tương ứng
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Loại bỏ password trước khi lưu vào state
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Email hoặc mật khẩu không đúng'));
      }
    });
  };

  // Đăng nhập với Google (giả lập)
  const loginWithGoogle = () => {
    return new Promise((resolve, reject) => {
      // Tạo một người dùng giả lập
      const googleUser = {
        uid: 'google-' + Date.now(),
        displayName: 'Google User',
        email: 'google.user@example.com',
        role: 'user'
      };
      
      setCurrentUser(googleUser);
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      
      // Thêm vào danh sách người dùng nếu chưa tồn tại
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.find(u => u.email === googleUser.email)) {
        users.push({...googleUser, password: 'google-auth'});
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      resolve(googleUser);
    });
  };

  // Đăng ký
  const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
      // Lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Kiểm tra xem email đã tồn tại chưa
      if (users.find(u => u.email === email)) {
        reject(new Error('Email đã được sử dụng'));
        return;
      }
      
      // Tạo người dùng mới
      const newUser = {
        uid: 'user-' + Date.now(),
        displayName: name,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Thêm vào danh sách người dùng
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Loại bỏ password trước khi lưu vào state
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      resolve(userWithoutPassword);
    });
  };

  // Đăng xuất
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  };

  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Tạo tài khoản admin
  const createAdminAccount = () => {
    return new Promise((resolve, reject) => {
      // Lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Kiểm tra xem admin đã tồn tại chưa
      const adminEmail = 'admin@example.com';
      if (users.find(u => u.email === adminEmail)) {
        resolve({ success: true, message: 'Tài khoản admin đã tồn tại' });
        return;
      }
      
      // Tạo tài khoản admin
      const adminUser = {
        uid: 'admin-' + Date.now(),
        displayName: 'Admin User',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      // Thêm vào danh sách người dùng
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      resolve({ 
        success: true, 
        message: 'Tài khoản admin đã được tạo thành công',
        user: { ...adminUser, password: undefined }
      });
    });
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    signup,
    signOut,
    isAdmin,
    createAdminAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
