function createPlaceholder(width, height, text = `${width} × ${height}`, retina = true) {
  const canvas = document.createElement('canvas');
  const scale = retina ? (window.devicePixelRatio || 2) : 1;

  // Set actual canvas size (scaled for retina)
  canvas.width = width * scale;
  canvas.height = height * scale;

  // Set display size (CSS pixels)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');

  // Scale the context to match
  ctx.scale(scale, scale);

  // Fill background
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.min(width, height) / 8;
  ctx.font = `${fontSize}px sans-serif`;

  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL('image/png');
}