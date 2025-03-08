// src/components/media/ImageGallery.tsx
import Image from 'next/image'
import React from 'react'

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, index) => (
        <Image
          key={index}
          src={img}
          alt={`Gallery ${index}`}
          className="object-cover w-full h-32 rounded"
        />
      ))}
    </div>
  )
}

export default ImageGallery
