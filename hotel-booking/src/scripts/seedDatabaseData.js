import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { rooms } from "../data/rooms";

/**
 * Thêm dữ liệu mẫu vào Firestore
 */
const seedDatabaseData = async () => {
  try {
    // Thêm phòng mẫu
    for (const room of rooms) {
      await setDoc(doc(db, "rooms", room.id.toString()), {
        ...room,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Đã thêm phòng: ${room.name}`);
    }

    // Thêm đặt phòng mẫu
    const bookings = [
      {
        userId: "admin_user_id", // Sẽ được cập nhật sau khi tạo admin
        roomId: 1,
        roomName: "Deluxe Room",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        checkIn: new Date("2023-06-15"),
        checkOut: new Date("2023-06-20"),
        guests: 2,
        nights: 5,
        roomPrice: 150,
        totalPrice: 750,
        status: "completed",
        createdAt: serverTimestamp(),
      },
      {
        userId: "admin_user_id", // Sẽ được cập nhật sau khi tạo admin
        roomId: 2,
        roomName: "Family Suite",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "987-654-3210",
        checkIn: new Date("2023-07-10"),
        checkOut: new Date("2023-07-15"),
        guests: 3,
        nights: 5,
        roomPrice: 250,
        totalPrice: 1250,
        status: "upcoming",
        createdAt: serverTimestamp(),
      },
      {
        userId: "admin_user_id", // Sẽ được cập nhật sau khi tạo admin
        roomId: 3,
        roomName: "Executive Suite",
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert@example.com",
        phone: "555-123-4567",
        checkIn: new Date("2023-05-20"),
        checkOut: new Date("2023-05-25"),
        guests: 2,
        nights: 5,
        roomPrice: 350,
        totalPrice: 1750,
        status: "cancelled",
        createdAt: serverTimestamp(),
      },
    ];

    for (const booking of bookings) {
      await addDoc(collection(db, "bookings"), booking);
      console.log(
        `Đã thêm đặt phòng cho: ${booking.firstName} ${booking.lastName}`
      );
    }

    // Thêm đánh giá mẫu
    const reviews = [
      {
        roomId: 1,
        userId: "admin_user_id", // Sẽ được cập nhật sau khi tạo admin
        userName: "Admin User",
        userEmail: "admin@example.com",
        rating: 5,
        comment:
          "Phòng rất tuyệt vời, sạch sẽ và thoải mái. Nhân viên rất thân thiện và hữu ích.",
        createdAt: serverTimestamp(),
        status: "approved",
      },
      {
        roomId: 2,
        userId: "guest_user_id",
        userName: "John Doe",
        userEmail: "john@example.com",
        rating: 4,
        comment:
          "Phòng rộng rãi và thoải mái cho gia đình. Tuy nhiên, Wi-Fi hơi chậm.",
        createdAt: serverTimestamp(),
        status: "approved",
      },
      {
        roomId: 3,
        userId: "guest_user_id",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        rating: 5,
        comment:
          "Phòng sang trọng với tầm nhìn tuyệt vời. Dịch vụ phòng nhanh chóng và hiệu quả.",
        createdAt: serverTimestamp(),
        status: "pending",
      },
    ];

    for (const review of reviews) {
      await addDoc(collection(db, "reviews"), review);
      console.log(`Đã thêm đánh giá từ: ${review.userName}`);
    }

    return {
      success: true,
      message: "Đã thêm dữ liệu mẫu thành công!",
    };
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu mẫu:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Cập nhật userId trong dữ liệu mẫu
 */
export const updateSampleDataWithAdminId = async (adminId) => {
  try {
    // Cập nhật userId trong bookings và reviews
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", "admin_user_id")
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);

    bookingsSnapshot.forEach(async (docSnapshot) => {
      await updateDoc(doc(db, "bookings", docSnapshot.id), { userId: adminId });
    });

    const reviewsQuery = query(
      collection(db, "reviews"),
      where("userId", "==", "admin_user_id")
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);

    reviewsSnapshot.forEach(async (docSnapshot) => {
      await updateDoc(doc(db, "reviews", docSnapshot.id), { userId: adminId });
    });

    return {
      success: true,
      message: "Đã cập nhật dữ liệu mẫu với ID admin!",
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu mẫu:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default seedDatabaseData;
