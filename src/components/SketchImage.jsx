import React, { useState } from 'react';
import { Download, Image as ImageIcon, Trash2, Eye, Sparkles, Layers, Pencil, Box, Loader2 } from 'lucide-react';
import ComparisonSlider from './ComparisonSlider';
import html2canvas from 'html2canvas';
import { processImageStyle } from '../utils/sketchProcessor';

const STYLES = [
  { id: 'graphite', label: 'قەڵەم', icon: Pencil },
  { id: 'gold', label: 'زێڕ', icon: Sparkles },
  { id: 'clay', label: 'قوڕ', icon: Layers },
  { id: '3d', label: '3D', icon: Box }
];

const SketchImage = ({ image, onRemove }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [activeStyle, setActiveStyle] = useState(image.styleId || 'graphite');
  const [processedSrc, setProcessedSrc] = useState(image.src);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadPNG = async () => {
    const card = document.getElementById(`sketch-canvas-${image.id}`);
    const canvas = await html2canvas(card);
    const link = document.createElement('a');
    link.download = `wenakesh-${activeStyle}-${image.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadJPG = async () => {
    const card = document.getElementById(`sketch-canvas-${image.id}`);
    const canvas = await html2canvas(card);
    const link = document.createElement('a');
    link.download = `wenakesh-${activeStyle}-${image.name}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const changeStyle = (styleId) => {
    if (styleId === activeStyle || isProcessing) return;
    setIsProcessing(true);
    setActiveStyle(styleId);
    
    const img = new window.Image();
    img.onload = () => {
      setTimeout(() => {
        const newSrc = processImageStyle(img, styleId);
        setProcessedSrc(newSrc);
        setIsProcessing(false);
      }, 10);
    };
    img.src = image.originalSrc;
  };

  return (
    <div className="sketch-card-v2" id={`sketch-canvas-${image.id}`}>
      <div className="sketch-container-v2" style={{ position: 'relative' }}>
        {showPreview ? (
          <ComparisonSlider before={image.originalSrc} after={processedSrc} /> 
        ) : (
          <>
            <img src={processedSrc} alt={image.name} className="sketch-image-base-v2" />
            {isProcessing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <Loader2 size={48} className="animate-spin" />
              </div>
            )}
          </>
        )}

        <div className="sketch-actions-v2 no-print" style={{ zIndex: 20 }}>
          <button onClick={() => setShowPreview(!showPreview)} className="action-btn" title="پیشاندانی پێش/پاش">
            <Eye size={18} />
          </button>
          <button onClick={handleDownloadPNG} className="action-btn" title="داگرتن وەک PNG">
            <Download size={18} />
          </button>
          <button onClick={handleDownloadJPG} className="action-btn" title="داگرتن وەک JPG">
            <ImageIcon size={18} />
          </button>
          <button onClick={() => onRemove(image.id)} className="action-btn delete" title="سڕینەوە">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="image-style-controls no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {STYLES.map(style => {
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              onClick={() => changeStyle(style.id)}
              style={{
                background: activeStyle === style.id ? '#121212' : '#fff',
                color: activeStyle === style.id ? '#fff' : '#666',
                border: '1px solid #ddd',
                padding: '0.5rem 1.2rem',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: activeStyle === style.id ? '600' : '400',
                transition: 'all 0.3s'
              }}
            >
              <Icon size={14} />
              {style.label}
            </button>
          );
        })}
      </div>

      <div className="sketch-info-v2">
        <h4 className="serif">{image.name.split('.')[0]}</h4>
        <p className="artist-note" style={{marginTop: '0.25rem', color: '#888'}}>
          ستایلی چالاک: {STYLES.find(s => s.id === activeStyle)?.label}
        </p>
      </div>
    </div>
  );
};

export default SketchImage;
