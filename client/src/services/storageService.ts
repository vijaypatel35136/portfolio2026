import { supabase } from '../lib/supabase'

const BUCKET_NAME = 'portfolio-files'
const PROJECT_IMAGES_FOLDER = 'project-images'

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  projectId?: number
): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${random}.${fileExt}`
    const filePath = projectId
      ? `${PROJECT_IMAGES_FOLDER}/${projectId}/${fileName}`
      : `${PROJECT_IMAGES_FOLDER}/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload multiple images to Supabase Storage
 */
export async function uploadImages(
  files: File[],
  projectId?: number
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, projectId))
  return Promise.all(uploadPromises)
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const filePath = pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join('/')

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Delete multiple images from Supabase Storage
 */
export async function deleteImages(imageUrls: string[]): Promise<void> {
  const deletePromises = imageUrls.map(url => deleteImage(url))
  await Promise.all(deletePromises)
}
