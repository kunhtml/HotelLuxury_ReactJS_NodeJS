import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Luxury Hotel</h1>
          <p>Experience luxury and comfort like never before</p>
          <Link to="/rooms" className="cta-button">Explore Rooms</Link>
        </div>
      </section>
      
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🌟</div>
          <h3>Luxurious Rooms</h3>
          <p>Our rooms are designed with luxury and comfort in mind.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🍽️</div>
          <h3>Fine Dining</h3>
          <p>Enjoy exquisite meals prepared by our world-class chefs.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🏊</div>
          <h3>Premium Amenities</h3>
          <p>Access to pool, spa, gym, and other premium facilities.</p>
        </div>
      </section>
      
      <section className="about">
        <div className="about-content">
          <h2>About Our Hotel</h2>
          <p>
            Luxury Hotel is a premier destination for travelers seeking comfort, elegance, and exceptional service.
            Located in the heart of the city, our hotel offers easy access to major attractions, shopping centers, and business districts.
          </p>
          <p>
            With a range of rooms and suites to choose from, we cater to the needs of all our guests, whether you're traveling for business or pleasure.
            Our dedicated staff is committed to making your stay memorable and enjoyable.
          </p>
        </div>
      </section>
      
      <section className="cta-section">
        <h2>Ready to Experience Luxury?</h2>
        <p>Book your stay now and enjoy special rates for early bookings.</p>
        <Link to="/booking" className="cta-button">Book Now</Link>
      </section>
    </div>
  );
};

export default Home;
