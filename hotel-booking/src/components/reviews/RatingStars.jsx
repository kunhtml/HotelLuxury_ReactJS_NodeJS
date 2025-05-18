import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './Reviews.css';

const RatingStars = ({ initialRating = 0, onChange, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    if (readOnly) return;
    
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <FaStar
            key={index}
            className={`star ${value <= (hover || rating) ? 'filled' : 'empty'}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readOnly && setHover(value)}
            onMouseLeave={() => !readOnly && setHover(null)}
            size={readOnly ? 16 : 24}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
