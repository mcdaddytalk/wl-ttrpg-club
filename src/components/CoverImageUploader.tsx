'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getCroppedImg } from '@/utils/imageCrop';
import Image from 'next/image';
import logger from '@/utils/logger';
import { deleteGameCover, uploadGameCover } from '@/utils/storage';

interface CoverImageUploaderProps {
  gameId: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function CoverImageUploader({ gameId, value, onChange, disabled }: CoverImageUploaderProps) {
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageSrc(result);
        setCropModalOpen(true);
      } else {
        toast.error("Failed to read file.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 20 * 1024 * 1024,
    onDrop,
    disabled,
    multiple: false
  });

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async (): Promise<void> => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], 'cover.jpg', { type: 'image/jpeg' });

      const publicUrl = await uploadGameCover(gameId, file);
      onChange(publicUrl);
      toast.success('Cover image updated.');
    } catch (err: unknown) {
      logger.error(err);
      toast.error('Image crop or upload failed.');
    } finally {
      setCropModalOpen(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleRemove = async (): Promise<void> => {
    try {
      await deleteGameCover(gameId);
      onChange("default");
      toast.success("Cover image removed.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error.";
      toast.error(`Failed to remove image: ${message}`);
    }
  };

  const hasCover = Boolean(value && value !== "default");

  return (
    <div className="space-y-2">
      {hasCover && (
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded border">
            <Image
              src={value}
              alt="Cover preview"
              fill
              sizes="(min-width: 768px) 100vw, 100vw"
              className="h-full w-full object-cover"
              priority={false}
            />
          </AspectRatio>
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            className="mt-2"
            disabled={disabled}
          >
            Remove Image
          </Button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${disabled ? "opacity-60" : ""}`}
        aria-disabled={disabled}
      >
        <input {...getInputProps()} aria-label="Upload cover image" />
        {isDragActive ? (
          <p>Drop image here…</p>
        ) : (
          <p>Click or drag an image to upload and crop</p>
        )}
      </div>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Cover Image</DialogTitle>
          </DialogHeader>

          <div className="relative h-[300px] w-full bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                restrictPosition
                showGrid={false}
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
              onValueChange={(vals: number[]) => {
                const [z] = vals;
                setZoom(typeof z === "number" ? z : 1);
              }}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setCropModalOpen(false)}
              variant="ghost"
            >
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