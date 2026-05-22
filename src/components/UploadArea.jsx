import React, { useState, useRef } from 'react';
import { Plus, Loader2, Sparkles, Layers, Pencil, Box } from 'lucide-react';
import { processImageStyle, processFile } from '../utils/sketchProcessor';

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
    const imageFiles = files.filter(file => (file.type && file.type.startsWith('image/')) || /\.heic$|\.heif$/i.test(file.name));
    if (imageFiles.length === 0) return;

    setIsProcessing(true);

    imageFiles.forEach((file) => {
      const id = Date.now() + Math.random();
      const previewURL = URL.createObjectURL(file);
      const styleLabel = STYLES.find(s => s.id === activeStyle)?.label || '';

      // Immediately add a lightweight preview so the UI is responsive
      onUpload({
        id,
        src: previewURL,
        originalSrc: previewURL,
        name: file.name.split('.')[0],
        styleId: activeStyle,
        styleLabel: styleLabel,
        date: new Date().toLocaleDateString('ku-IQ', { day: 'numeric', month: 'long', year: 'numeric' }),
        processing: true
      });

      // Process in background and then update the entry by re-sending with same id
      (async () => {
        try {
          const { sketchedSrc, safeOriginalSrc } = await processFile(file, activeStyle);
          onUpload({
            id,
            src: sketchedSrc,
            originalSrc: safeOriginalSrc,
            name: file.name.split('.')[0],
            styleId: activeStyle,
            styleLabel: styleLabel,
            date: new Date().toLocaleDateString('ku-IQ', { day: 'numeric', month: 'long', year: 'numeric' }),
            processing: false
          });
        } catch (err) {
          console.error('Failed to process file', file.name, err);
          // mark processing false even on failure
          onUpload({ id, processing: false });
        } finally {
          // release preview URL
          URL.revokeObjectURL(previewURL);
        }
      })();
    });

    // Quick exit; processing continues in background
    setIsProcessing(false);
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
          accept="image/*,.heic,.heif"
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
