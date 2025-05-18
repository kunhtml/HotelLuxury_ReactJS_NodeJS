import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Chào Mừng Đến Với Khách Sạn Luxury</h1>
          <p>Trải nghiệm sự sang trọng và thoải mái chưa từng có</p>
          <Link to="/rooms" className="cta-button">
            Khám Phá Phòng
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🌟</div>
          <h3>Phòng Sang Trọng</h3>
          <p>
            Phòng của chúng tôi được thiết kế với sự sang trọng và thoải mái.
          </p>
        </div>
        <div className="feature">
          <div className="feature-icon">🍽️</div>
          <h3>Ẩm Thực Tinh Tế</h3>
          <p>
            Thưởng thức các bữa ăn tuyệt vời được chuẩn bị bởi đầu bếp đẳng cấp
            thế giới.
          </p>
        </div>
        <div className="feature">
          <div className="feature-icon">🏊</div>
          <h3>Tiện Nghi Cao Cấp</h3>
          <p>
            Truy cập hồ bơi, spa, phòng tập gym và các tiện nghi cao cấp khác.
          </p>
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <h2>Về Khách Sạn Của Chúng Tôi</h2>
          <p>
            Khách sạn Luxury là điểm đến hàng đầu cho du khách tìm kiếm sự thoải
            mái, sang trọng và dịch vụ đặc biệt. Tọa lạc tại trung tâm thành
            phố, khách sạn của chúng tôi cung cấp khả năng tiếp cận dễ dàng đến
            các điểm tham quan chính, trung tâm mua sắm và khu vực kinh doanh.
          </p>
          <p>
            Với nhiều loại phòng và suite để lựa chọn, chúng tôi đáp ứng nhu cầu
            của tất cả khách hàng, dù bạn đi công tác hay du lịch. Đội ngũ nhân
            viên tận tâm của chúng tôi cam kết làm cho kỳ nghỉ của bạn đáng nhớ
            và thú vị.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Sẵn Sàng Trải Nghiệm Sự Sang Trọng?</h2>
        <p>Đặt phòng ngay và tận hưởng giá đặc biệt cho đặt phòng sớm.</p>
        <Link to="/booking" className="cta-button">
          Đặt Ngay
        </Link>
      </section>
    </div>
  );
};

export default Home;
