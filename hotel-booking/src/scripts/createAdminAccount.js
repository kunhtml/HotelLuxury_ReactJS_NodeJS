import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Tạo tài khoản admin demo
 * Chạy script này một lần để tạo tài khoản admin
 */
const createAdminAccount = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin User';

  try {
    // Tạo tài khoản người dùng mới
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminEmail, 
      adminPassword
    );
    
    const user = userCredential.user;
    
    // Cập nhật tên hiển thị
    await updateProfile(user, {
      displayName: adminName
    });
    
    // Lưu thông tin người dùng vào Firestore với role là 'admin'
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: adminName,
      email: adminEmail,
      role: 'admin', // Đây là trường quan trọng để xác định quyền admin
      createdAt: new Date()
    });
    
    console.log('Tài khoản admin đã được tạo thành công!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
    return {
      success: true,
      user: user
    };
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export default createAdminAccount;
