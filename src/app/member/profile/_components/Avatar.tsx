'use client'

import React, { useEffect, useState, useRef } from 'react'
import createSupabaseBrowserClient from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import logger from '@/utils/logger'

interface AvatarProps {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: AvatarProps) {
  const supabase = createSupabaseBrowserClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        let imageUrl = path
        if (!path.includes('http')) {
          const { data, error } = await supabase.storage.from('avatars').download(path)
          if (error) throw error
          imageUrl = URL.createObjectURL(data)
        }
        setAvatarUrl(imageUrl)
      } catch (error) {
        logger.error('Error downloading image:', error)
        toast.error('Failed to load avatar.')
      }
    }
    logger.debug('Avatar URL:', url)
    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
      toast.success('Avatar uploaded successfully!')
    } catch (error) {
      logger.error('Avatar Upload Error:', error)
      toast.error('Error uploading avatar.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Hidden File Input */}
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={uploadAvatar}
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {/* Avatar Image with Overlay */}
      <div
        className="relative group cursor-pointer rounded-full overflow-hidden"
        style={{ height: size, width: size }}
        onClick={() => fileInputRef.current?.click()}
      >
        {avatarUrl ? (
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt="User Avatar"
            className="object-cover rounded-full"
            priority
          />
        ) : (
          <Skeleton className="rounded-full w-full h-full" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <Pencil className="text-white w-6 h-6" />
        </div>
      </div>

      {/* Upload Button (fallback option) */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload New Avatar'}
      </Button>
    </div>
  )
}
