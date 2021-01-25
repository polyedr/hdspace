const getImageFromUrl = (imageUrl: string): Promise<File> => {
  if (!imageUrl) {
    return Promise.reject(new Error('Image URL is not specified'));
  }
  const canvasEl = document.createElement('canvas');
  const ctx = canvasEl.getContext('2d');
  const imageEl = document.createElement('img');
  return new Promise((resolve, reject) => {
    imageEl.onload = () => {
      console.log('ONLOAD WORKS!!');
      if (!ctx) {
        reject(new Error('Image context is not defined'));
        return;
      }
      const width = imageEl.naturalWidth;
      const height = imageEl.naturalHeight;
      canvasEl.width = width;
      canvasEl.height = height;
      ctx.drawImage(imageEl, 0, 0, width, height);
      canvasEl.toBlob((blob) => {
        if (blob && imageUrl) {
          const fileName = imageUrl.substring(imageUrl.lastIndexOf('/'));
          const file = new File([blob], fileName);
          ctx.clearRect(0, 0, width, height);
          resolve(file);
        }
      });
    };
    console.log('SET SRC!!!', imageUrl);
    try {
      // document.body.appendChild(imageEl);
      imageEl.src = imageUrl;
    } catch (e) {
      console.error('GOT ERROR!!', e);
      reject(e);
    }
  });
};

export default getImageFromUrl;
