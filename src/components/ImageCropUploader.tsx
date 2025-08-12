'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getCroppedImg } from '@/utils/imageCrop';
import Image from 'next/image';
import logger from '@/utils/logger';

interface ImageCropUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>; // upload handler returns public URL
  onDelete?: () => Promise<void>;            // optional delete handler
  aspectRatio?: number;                      // e.g., 1, 16 / 9, 4 / 3
  disabled?: boolean;
  placeholderUrl?: string;
}

export function ImageCropUploader({
  value,
  onChange,
  onUpload,
  onDelete,
  aspectRatio = 16 / 9,
  disabled,
  placeholderUrl = '/images/defaults/default_game.webp',
}: ImageCropUploaderProps) {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 20 * 1024 * 1024,
    onDrop,
    disabled,
  });

  const handleCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], 'cover.jpg', { type: 'image/jpeg' });

      const publicUrl = await onUpload(file);
      onChange(publicUrl);
      toast.success('Image uploaded.');
    } catch (err: any) {
      logger.error(err);
      toast.error('Image crop or upload failed.');
    } finally {
      setCropModalOpen(false);
      setImageSrc(null);
    }
  };

  const handleRemove = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
      onChange('default');
      toast.success('Image removed.');
    } catch (err: any) {
      toast.error(`Failed to remove image: ${err.message}`);
    }
  };

  const isDefault = value === 'default' || !value;

  return (
    <div className="space-y-2">
      <div className="relative">
        <AspectRatio ratio={aspectRatio} className="rounded border overflow-hidden">
          <Image
            src={isDefault ? placeholderUrl : value}
            alt="Preview"
            fill
            sizes="(min-width: 768px) 100vw, 100vw"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        {!isDefault && onDelete && (
          <Button type="button" variant="destructive" onClick={handleRemove} className="mt-2">
            Remove Image
          </Button>
        )}
      </div>

      <div
        {...getRootProps()}
        className={`border-dashed border-2 p-4 rounded-md text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop image here…</p> : <p>Click or drag an image to upload and crop</p>}
      </div>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>
          <div className="mt-4">
            <label className="text-sm">Zoom</label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" onClick={() => setCropModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button type="button" onClick={handleCropConfirm}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
