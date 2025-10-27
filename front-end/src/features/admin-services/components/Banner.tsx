import React, { useState, useEffect } from "react";

interface BannerProps {
  existingImage?: { url: string } | null;
  onFileSelect: (file: File) => void;
}

const Banner: React.FC<BannerProps> = ({ existingImage, onFileSelect }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (existingImage?.url) {
      setPreview(existingImage.url); 
    }
  }, [existingImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelect(file);
    setPreview(URL.createObjectURL(file)); 
  };

  return (
    <div className="flex flex-col items-center">
      {preview && (
        <img
          src={preview}
          alt="Banner Preview"
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};



export default Banner;
