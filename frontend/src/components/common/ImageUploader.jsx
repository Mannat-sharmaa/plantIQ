import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ImageUploader = ({
  onImageSelected,
  onError,
  className
}) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      if (onError) onError('Unsupported file format. Please upload JPEG, PNG, or WebP images.');
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      if (onError) onError('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected({
        file,
        previewUrl: e.target.result,
        name: file.name,
        sizeMb: (file.size / (1024 * 1024)).toFixed(2)
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndProcessFile(e.target.files[0]);
          }
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndProcessFile(e.target.files[0]);
          }
        }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[300px]",
          isDragging
            ? "border-primary bg-primary/10 shadow-neon-green"
            : "border-border/80 bg-surface/40 hover:border-primary/50 hover:bg-surface/70"
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-surface-light border border-border flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
          Drag & Drop leaf photo here
        </h3>
        <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
          Supports high-resolution PNG, JPG, or WebP up to 10MB. Ensure natural lighting with leaf symptoms centered.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            icon={ImageIcon}
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Device
          </Button>

          <Button
            size="sm"
            variant="subtle"
            icon={Camera}
            onClick={() => cameraInputRef.current?.click()}
          >
            Camera Capture
          </Button>
        </div>
      </div>
    </div>
  );
};
