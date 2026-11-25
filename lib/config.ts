// Cloudinary configuration — see README.md for setup steps.
// 1. Create a free Cloudinary account
// 2. Create an UNSIGNED upload preset (Settings → Upload)
// 3. Enable "Resource list" (Settings → Security)
// 4. Paste your values below
export const CONFIG = {
  CLOUD_NAME: "desk7uuna",
  UPLOAD_PRESET: "mba_notes_unsigned"
};

export const cloudinaryConfigured =
  !CONFIG.CLOUD_NAME.startsWith("YOUR_") && !CONFIG.UPLOAD_PRESET.startsWith("YOUR_");
