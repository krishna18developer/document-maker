export async function generateCertificate(
  rowData: string[], 
  elements: any[], 
  backgroundImage: string,
  headers: string[]
) {
  const canvas = document.createElement('canvas');
  canvas.width = 842;
  canvas.height = 595;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Draw background
  if (backgroundImage) {
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = backgroundImage;
    });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // Draw elements
  elements.forEach((element) => {
    ctx.font = `${element.fontSize}px ${element.fontFamily}`;
    ctx.fillStyle = element.color;
    
    let text = element.text;
    if (element.columnKey) {
      const columnIndex = headers.indexOf(element.columnKey);
      if (columnIndex !== -1) {
        text = rowData[columnIndex];
      }
    }
    
    ctx.fillText(text, element.x, element.y);
  });

  return canvas.toDataURL('image/png');
}
