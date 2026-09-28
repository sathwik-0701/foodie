/**
 * Cloudinary-ready Upload Service
 * Allows uploading base64/buffer image streams to Cloudinary when configured.
 * Falls back to returning passed URLs or static asset paths during local development.
 */
class UploadService {
  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (this.cloudName && this.apiKey && this.apiSecret) {
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: this.cloudName,
          api_key: this.apiKey,
          api_secret: this.apiSecret
        });
        this.cloudinary = cloudinary;
      } catch (err) {
        console.warn('[Cloudinary Init Warning]:', err.message);
      }
    }
  }

  async uploadImage(imageInput, folder = 'foodie') {
    if (this.cloudinary) {
      try {
        const result = await this.cloudinary.uploader.upload(imageInput, {
          folder,
          resource_type: 'image'
        });
        return { success: true, url: result.secure_url, public_id: result.public_id };
      } catch (error) {
        console.error('[Cloudinary Upload Error]:', error);
        return { success: false, error: error.message };
      }
    }

    // Fallback: return input if string (e.g. static image path or URL), or default mock avatar/food image
    return {
      success: true,
      url: typeof imageInput === 'string' && imageInput.startsWith('http')
        ? imageInput
        : '/assets/header_img.png',
      isMock: true
    };
  }
}

module.exports = new UploadService();
