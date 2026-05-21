/**
 * Ultimate Masterpiece Kurdish Portrait Engine
 * Supports: Graphite, Gold, Clay, and 3D Hologram
 */
export const processImageStyle = (imageElement, styleType = 'graphite') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let width = imageElement.naturalWidth || imageElement.width;
  let height = imageElement.naturalHeight || imageElement.height;

  // Fix for high-resolution mobile photos (e.g. from new smartphones)
  // Scaling down prevents canvas memory limits and performance issues
  const MAX_SIZE = 1600;
  if (width > MAX_SIZE || height > MAX_SIZE) {
    const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  if (styleType === 'gold') return processGold(imageElement, canvas, ctx, width, height);
  if (styleType === 'clay') return processClay(imageElement, canvas, ctx, width, height);
  if (styleType === '3d') return process3D(imageElement, canvas, ctx, width, height);
  return processGraphite(imageElement, canvas, ctx, width, height);
};

// 1. Graphite Sketch (قەڵەم خەڵووز)
const processGraphite = (img, canvas, ctx, width, height) => {
  ctx.filter = 'contrast(1.35) brightness(1.05)';
  ctx.drawImage(img, 0, 0, width, height);
  const sourceData = ctx.getImageData(0, 0, width, height).data;
  ctx.filter = 'none';
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      const gray = 0.299 * sourceData[i] + 0.587 * sourceData[i+1] + 0.114 * sourceData[i+2];
      
      if (gray > 220) continue;
      
      const opacity = (255 - gray) / 255;
      
      const neighbors = [((y * width + (x + 2)) * 4), (((y + 2) * width + x) * 4)];
      let contrast = 0;
      neighbors.forEach(ni => {
        if (ni < sourceData.length) {
          const ngray = (sourceData[ni] + sourceData[ni+1] + sourceData[ni+2]) / 3;
          contrast += Math.abs(gray - ngray);
        }
      });

      if (gray < 200) {
        ctx.globalAlpha = opacity * 0.35;
        ctx.fillStyle = `rgb(${gray + 20}, ${gray + 20}, ${gray + 20})`;
        ctx.beginPath();
        ctx.arc(x, y, step * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (contrast > 15 || gray < 100) {
        ctx.globalAlpha = opacity * 0.8;
        ctx.strokeStyle = gray < 80 ? '#000' : '#444';
        ctx.lineWidth = gray < 100 ? 0.6 : 0.2;
        const angle = contrast > 30 ? Math.PI / 2 : Math.PI / 4;
        const length = contrast > 30 ? 6 + Math.random() * 8 : 2 + Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
      }
    }
  }
  
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = width; finalCanvas.height = height;
  const fCtx = finalCanvas.getContext('2d');
  fCtx.fillStyle = 'white';
  fCtx.fillRect(0, 0, width, height);
  fCtx.drawImage(canvas, 0, 0);
  fCtx.filter = 'contrast(1.05) saturate(0)';
  fCtx.drawImage(finalCanvas, 0, 0);

  return finalCanvas.toDataURL('image/png');
};

// 2. Liquid Gold (زێڕی ڕوونا)
const processGold = (img, canvas, ctx, width, height) => {
  ctx.filter = 'contrast(1.2) sepia(1) hue-rotate(-15deg) saturate(2) brightness(1.1)';
  ctx.drawImage(img, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Enhance gold metallic look using luminance mapping
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    if (lum < 60) {
      data[i] = lum * 1.5; data[i+1] = lum * 0.8; data[i+2] = lum * 0.2;
    } else if (lum > 200) {
      data[i] = 255; data[i+1] = 255; data[i+2] = 200 + (lum - 200);
    } else {
      data[i] = Math.min(255, lum * 1.4);
      data[i+1] = Math.min(255, lum * 1.1);
      data[i+2] = lum * 0.4;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(8px) brightness(1.2)';
  ctx.globalAlpha = 0.4;
  ctx.drawImage(canvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;

  return canvas.toDataURL('image/jpeg', 0.95);
};

// 3. Raw Clay (قوڕی ڕەسەن)
const processClay = (img, canvas, ctx, width, height) => {
  ctx.fillStyle = '#b87333';
  ctx.fillRect(0, 0, width, height);
  
  ctx.globalCompositeOperation = 'luminosity';
  ctx.drawImage(img, 0, 0, width, height);
  
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = '#d98b54'; 
  ctx.globalAlpha = 0.6;
  ctx.fillRect(0, 0, width, height);
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Bump mapping and clay noise
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise * 0.9));
    data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise * 0.8));
  }
  ctx.putImageData(imgData, 0, 0);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = width; finalCanvas.height = height;
  const fCtx = finalCanvas.getContext('2d');
  fCtx.filter = 'contrast(0.9) blur(0.5px)';
  fCtx.drawImage(canvas, 0, 0);

  return finalCanvas.toDataURL('image/jpeg', 0.95);
};

// 4. 3D Hologram / Anaglyph (سێ ڕەهەندی)
const process3D = (img, canvas, ctx, width, height) => {
  ctx.filter = 'grayscale(1) contrast(1.2)';
  ctx.drawImage(img, 0, 0, width, height);
  const baseData = ctx.getImageData(0, 0, width, height).data;
  
  ctx.clearRect(0, 0, width, height);
  const outData = ctx.createImageData(width, height);
  
  const shift = Math.max(4, Math.floor(width * 0.008)); 

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      
      const redX = Math.max(0, x - shift);
      const redI = (y * width + redX) * 4;
      outData.data[i] = baseData[redI]; 
      
      const gbX = Math.min(width - 1, x + shift);
      const gbI = (y * width + gbX) * 4;
      outData.data[i+1] = baseData[gbI]; 
      outData.data[i+2] = baseData[gbI]; 
      
      outData.data[i+3] = 255; 
      
      if (y % 4 === 0) {
        outData.data[i] *= 0.85;
        outData.data[i+1] *= 0.85;
        outData.data[i+2] *= 0.85;
      }
    }
  }
  
  ctx.putImageData(outData, 0, 0);
  
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(20, 0, 40, 0.2)';
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.95);
};
