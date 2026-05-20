import React, { useState, useRef, useEffect } from 'react';

const ComparisonSlider = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.pageX || e.touches[0].pageX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      className="comparison-slider" 
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="after-image" style={{ width: `${sliderPos}%` }}>
        <img src={after} alt="Sketch" />
      </div>
      <div className="before-image">
        <img src={before} alt="Original" />
      </div>
      <div className="slider-handle" style={{ left: `${sliderPos}%` }}>
        <div className="handle-line"></div>
        <div className="handle-circle">
          <span>&larr; &rarr;</span>
        </div>
      </div>
      <div className="slider-labels">
        <span className="label-before">وێنەی سەرەکی</span>
        <span className="label-after">تابلۆی کێشراو</span>
      </div>
    </div>
  );
};

export default ComparisonSlider;
