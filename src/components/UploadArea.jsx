import React, { useState, useRef } from 'react';
import { Plus, Loader2, Sparkles, Layers, Pencil, Box } from 'lucide-react';
import { processImageStyle } from '../utils/sketchProcessor';

const STYLES = [
  { id: 'graphite', label: 'قەڵەم خەڵووز', icon: Pencil },
  { id: 'gold', label: 'زێڕی ڕوونا', icon: Sparkles },
  { id: 'clay', label: 'قوڕی ڕەسەن', icon: Layers },
  { id: '3d', label: 'سێ ڕەهەندی', icon: Box }
];

const UploadArea = ({ onUpload }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStyle, setActiveStyle] = useState('graphite');
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setIsProcessing(true);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const sketchedSrc = processImageStyle(img, activeStyle);
          
          const styleLabel = STYLES.find(s => s.id === activeStyle)?.label || '';
          
          onUpload({
            id: Date.now() + Math.random(),
            src: sketchedSrc,
            originalSrc: e.target.result,
            name: file.name.split('.')[0],
            styleId: activeStyle,
            styleLabel: styleLabel,
            date: new Date().toLocaleDateString('ku-IQ', { day: 'numeric', month: 'long', year: 'numeric' })
          });
          setIsProcessing(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e) => {
    if (isProcessing) return;
    handleFiles(Array.from(e.target.files));
  };

  return (
    <div className="upload-container">
      <div className="style-selector no-print">
        {STYLES.map(style => {
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              className={`style-btn ${activeStyle === style.id ? 'active' : ''}`}
              onClick={() => !isProcessing && setActiveStyle(style.id)}
              disabled={isProcessing}
            >
              <Icon size={16} />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>

      <div 
        className={`upload-area no-print ${isProcessing ? 'processing' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon-container">
          {isProcessing ? (
            <Loader2 size={48} strokeWidth={1} className="animate-spin" />
          ) : (
            <Plus size={48} strokeWidth={1} />
          )}
        </div>
        
        <div className="upload-label">
          <h3>{isProcessing ? 'وێنەکێشەکە خەریکی کارە...' : 'هاوردەکردنی وێنە'}</h3>
          <p>{isProcessing ? 'جێبەجێکردنی ستایلی مۆدێرن و ئەلگۆریتمەکانی وێنەسازی' : 'وێنەکە ڕابکێشە ئێرە یان کرتە بکە بۆ گەڕان لە ستۆدیۆکەتدا'}</p>
          {!isProcessing && <span className="file-hint">ڕێکخراو بۆ A4 • پێشنیارکراوە بۆ باشترین کوالیتی</span>}
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
