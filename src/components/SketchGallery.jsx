import React from 'react';
import SketchImage from './SketchImage';

const SketchGallery = ({ images, onRemove }) => {
  if (images.length === 0) {
    return (
      <div className="empty-gallery no-print">
        <p className="serif italic">دەفتەری کارەکانت لە ئێستادا بەتاڵە.</p>
        <p className="hint">وێنەیەک هاوردە بکە بۆ دەستپێکردنی کارەکەت.</p>
      </div>
    );
  }

  return (
    <div className="sketch-gallery">
      {images.map(image => (
        <SketchImage 
          key={image.id} 
          image={image} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
};

export default SketchGallery;
