import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper(props) {
  const { imageToCrop, onImageCropped, setResult } = props;

  const [cropConfig, setCropConfig] = useState({
    unit: '%',
    height: 100,
    aspect: 1 / 1,
  });

  const [imageRef, setImageRef] = useState();

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height,
    );

    const base64Image = canvas.toDataURL('image/jpeg', 1);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        blob.name = fileName;
        setResult(base64Image, blob);

        const croppedImageUrl = window.URL.createObjectURL(blob);

        resolve(croppedImageUrl);
      }, 'image/jpeg');
    });
  }

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        'croppedImage.jpeg',
      );

      onImageCropped?.(croppedImage);
    }
  }

  return (
    <ReactCrop
      src={imageToCrop || ''}
      // @ts-ignore
      crop={cropConfig}
      ruleOfThirds
      onImageLoaded={(imageRef: any) => setImageRef(imageRef)}
      onComplete={(cropConfig) => cropImage(cropConfig)}
      onChange={(cropConfig: any) => setCropConfig(cropConfig)}
      crossorigin="anonymous"
      minHeight={25}
      maxHeight={100}
    />
  );
}

export default ImageCropper;
