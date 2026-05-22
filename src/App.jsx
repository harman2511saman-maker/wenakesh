import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import SketchGallery from './components/SketchGallery';
import PrintButton from './components/PrintButton';
import './App.css';

function App() {
  const [images, setImages] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sketchbook-images');
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load sketches", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('sketchbook-images', JSON.stringify(images));
  }, [images]);

  const handleUpload = (newImage) => {
    setImages(prev => {
      if (!newImage || !newImage.id) return prev;
      const exists = prev.find(img => img.id === newImage.id);
      if (exists) {
        // replace existing entry, keep order
        return prev.map(img => img.id === newImage.id ? { ...img, ...newImage } : img);
      }
      return [newImage, ...prev];
    });
  };

  const handleRemove = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="app-container">
      <Header />
      
      <main>
        <section className="studio-controls no-print">
          <UploadArea onUpload={handleUpload} />
          {images.length > 0 && <PrintButton />}
        </section>

        <section className="gallery-section">
          <div className="section-header no-print">
            <h2 className="serif">تاقیکردنەوەکانی ئێستا</h2>
            <div className="header-line"></div>
          </div>
          <SketchGallery images={images} onRemove={handleRemove} />
        </section>
      </main>

      <footer className="no-print">
        <p>&copy; {new Date().getFullYear()} ستۆدیۆی وێنەکێش. ڕووکاری کوردیی سۆرانیی پوخت.</p>
      </footer>

      {/* Print-only Header */}
      <div className="print-only" style={{ display: 'none' }}>
        <h1 style={{ fontFamily: 'Vazirmatn, Playfair Display', textAlign: 'center', marginBottom: '2rem' }}>
          پۆرتفۆلیۆی تاقیکردنەوەکانی قەڵەم خەڵووز
        </h1>
      </div>
    </div>
  );
}

export default App;
